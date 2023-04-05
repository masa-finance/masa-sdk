import { MasaModuleBase } from "./masa-module-base";
import { BaseResult, isNativeCurrency, PaymentMethod } from "../../interface";
import { BigNumber } from "@ethersproject/bignumber";
import { Messages, signTypedData } from "../../utils";
import { Contract, Wallet } from "ethers";
import { Link, loadLinks } from "../../soul-linker";

export type BreakLinkResult = BaseResult;

export class SoulLinker extends MasaModuleBase {
  /**
   *
   */
  types = {
    Link: [
      { name: "readerIdentityId", type: "uint256" },
      { name: "ownerIdentityId", type: "uint256" },
      { name: "token", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "signatureDate", type: "uint256" },
      { name: "expirationDate", type: "uint256" },
    ],
  };

  /**
   * Gets price for establishing a link
   * @param tokenAddress
   * @param paymentMethod
   * @param slippage
   */
  getPrice = async (
    tokenAddress: string,
    paymentMethod: PaymentMethod,
    slippage: number | undefined = 250
  ): Promise<{ price: BigNumber; paymentAddress: string }> => {
    const paymentAddress = this.getPaymentAddress(paymentMethod);
    let price = await this.instances.SoulLinkerContract.getPriceForAddLink(
      paymentAddress,
      tokenAddress
    );

    if (slippage) {
      if (isNativeCurrency(paymentMethod)) {
        price = this.addSlippage(price, slippage);
      }
    }

    if (this.masa.config.verbose) {
      console.info({ paymentAddress, price });
    }

    return {
      price,
      paymentAddress,
    };
  };
  /**
   * Adds a link to the soullinker
   * @param tokenAddress
   * @param paymentMethod
   * @param readerIdentityId
   * @param ownerIdentityId
   * @param tokenId
   * @param signatureDate
   * @param expirationDate
   * @param signature
   * @param slippage
   */
  addLink = async (
    tokenAddress: string,
    paymentMethod: PaymentMethod,
    readerIdentityId: BigNumber,
    ownerIdentityId: BigNumber,
    tokenId: BigNumber,
    signatureDate: number,
    expirationDate: number,
    signature: string,
    slippage: number | undefined = 250
  ): Promise<boolean> => {
    const { price, paymentAddress } = await this.getPrice(
      tokenAddress,
      paymentMethod,
      slippage
    );

    await this.checkOrGiveAllowance(
      paymentAddress,
      paymentMethod,
      this.instances.SoulLinkerContract.address,
      price
    );

    const {
      estimateGas: { addLink: estimateGas },
      addLink,
    } = this.instances.SoulLinkerContract.connect(this.masa.config.wallet);

    const params: [
      string,
      BigNumber,
      BigNumber,
      string,
      BigNumber,
      number,
      number,
      string
    ] = [
      paymentAddress,
      readerIdentityId,
      ownerIdentityId,
      tokenAddress,
      tokenId,
      signatureDate,
      expirationDate,
      signature,
    ];

    const overrides = {
      value: isNativeCurrency(paymentMethod) ? price : undefined,
    };

    let gasLimit: BigNumber = await estimateGas(...params, overrides);

    if (this.masa.config.network?.gasSlippagePercentage) {
      gasLimit = this.addSlippage(
        gasLimit,
        this.masa.config.network.gasSlippagePercentage
      );
    }

    const overridesWithGasLimit = {
      ...overrides,
      gasLimit,
    };

    const { wait, hash } = await addLink(...params, overridesWithGasLimit);

    console.log(Messages.WaitingToFinalize(hash));
    await wait();

    return true;
  };

  /**
   * Signs a soul linker link
   * @param readerIdentityId
   * @param ownerIdentityId
   * @param tokenAddress
   * @param tokenId
   * @param signatureDate
   * @param expirationOffset
   */
  signLink = async (
    readerIdentityId: BigNumber,
    ownerIdentityId: BigNumber,
    tokenAddress: string,
    tokenId: BigNumber,
    // now
    signatureDate: number = Math.floor(Date.now() / 1000),
    // default to 15 minutes
    expirationOffset: number = 60 * 15
  ) => {
    const expirationDate = signatureDate + expirationOffset;

    const value: {
      readerIdentityId: BigNumber;
      ownerIdentityId: BigNumber;
      token: string;
      tokenId: BigNumber;
      signatureDate: number;
      expirationDate: number;
    } = {
      readerIdentityId,
      ownerIdentityId,
      token: tokenAddress,
      tokenId,
      signatureDate,
      expirationDate,
    };

    const { signature, domain } = await signTypedData(
      this.instances.SoulLinkerContract,
      this.masa.config.wallet as Wallet,
      "SoulLinker",
      this.types,
      value
    );

    await this.verify(
      "Signing SBT failed!",
      this.instances.SoulLinkerContract,
      domain,
      this.types,
      value,
      signature,
      await this.masa.config.wallet.getAddress()
    );

    return { signature, signatureDate, expirationDate };
  };

  /**
   *
   * @param contract
   * @param tokenId
   * @param readerIdentityId
   */
  breakLink = async (
    contract: Contract,
    tokenId: BigNumber,
    readerIdentityId: BigNumber
  ): Promise<BreakLinkResult> => {
    const result: BreakLinkResult = {
      success: false,
      message: "Unknown Error",
    };

    const { identityId, address } = await this.masa.identity.load();
    if (!identityId) {
      result.message = Messages.NoIdentity(address);
      console.error(result.message);
      return result;
    }

    const links: Link[] = await loadLinks(this.masa, contract, tokenId);

    console.log({ links, readerIdentityId });

    const filteredLinks: Link[] = links.filter(
      (link: Link) =>
        link.readerIdentityId.toString() === readerIdentityId.toString() &&
        link.exists &&
        !link.isRevoked
    );

    console.log({ filteredLinks });

    for (const link of filteredLinks) {
      console.log(`Breaking link ${JSON.stringify(link, undefined, 2)}`);

      const { revokeLink } =
        this.masa.contracts.instances.SoulLinkerContract.connect(
          this.masa.config.wallet
        );

      const { wait, hash } = await revokeLink(
        readerIdentityId,
        identityId,
        contract.address,
        tokenId,
        link.signatureDate
      );

      console.log(Messages.WaitingToFinalize(hash));
      await wait();
    }

    return result;
  };
}
