import { BigNumber } from "@ethersproject/bignumber";
import { IERC20, IERC20__factory } from "@masa-finance/masa-contracts-identity";
import { BigNumberish, BytesLike, ethers } from "ethers";
import { addresses, loadIdentityContracts } from "./index";
import { IIdentityContracts, MasaConfig } from "../interface";
import { verifyTypedData } from "ethers/lib/utils";
import { generateSignatureDomain } from "../utils";
import { ERC20__factory } from "./stubs/ERC20__factory";

export type PaymentMethod = "eth" | "weth" | "stable" | "utility";

export class MasaContracts {
  public identity: IIdentityContracts;

  public constructor(private masaConfig: MasaConfig) {
    this.identity = loadIdentityContracts({
      provider: masaConfig.wallet.provider,
      network: masaConfig.network,
    });
  }

  private getPaymentAddress(paymentMethod: PaymentMethod) {
    let paymentAddress = ethers.constants.AddressZero;

    switch (paymentMethod) {
      case "utility":
        paymentAddress =
          addresses[this.masaConfig.network].MASA ||
          ethers.constants.AddressZero;
        break;
      case "stable":
        paymentAddress =
          addresses[this.masaConfig.network].USDC ||
          ethers.constants.AddressZero;
        break;
      case "weth":
        paymentAddress =
          addresses[this.masaConfig.network].WETH ||
          ethers.constants.AddressZero;
        break;
    }

    return paymentAddress;
  }

  async addLink(
    signer: ethers.Signer,
    tokenAddress: string,
    paymentMethod: PaymentMethod,
    readerIdentityId: BigNumber,
    ownerIdentityId: BigNumber,
    tokenId: BigNumber,
    signatureDate: number,
    expirationDate: number,
    signature: string,
    slippage: number | undefined = 250
  ): Promise<boolean> {
    const paymentMethodUsed = this.getPaymentAddress(paymentMethod);
    let price = await this.identity.SoulLinkerContract.getPriceForAddLink(
      paymentMethodUsed,
      tokenAddress
    );

    if (slippage) {
      if (paymentMethod === "eth") {
        price = price.add(price.mul(slippage).div(10000));
      }
    }

    console.log({ paymentMethodUsed, price });

    if (paymentMethod !== "eth") {
      const paymentToken: IERC20 = IERC20__factory.connect(
        paymentMethodUsed,
        signer
      );

      const allowance = await paymentToken.allowance(
        await signer.getAddress(),
        this.identity.SoulLinkerContract.address
      );
      if (allowance < price) {
        console.log("approving allowance");
        await paymentToken.approve(
          this.identity.SoulLinkerContract.address,
          price
        );
      }
    }

    const response = await this.identity.SoulLinkerContract.connect(
      signer
    ).addLink(
      paymentMethodUsed,
      readerIdentityId,
      ownerIdentityId,
      tokenAddress,
      tokenId,
      signatureDate,
      expirationDate,
      signature,
      paymentMethod === "eth" ? { value: price } : undefined
    );

    const tx = await response.wait();
    console.log(tx.transactionHash);

    return true;
  }

  async getSoulNames(address: string): Promise<string[]> {
    const soulNames = await this.identity.SoulboundIdentityContract[
      "getSoulNames(address)"
    ](address);

    console.log("Soul names", soulNames);
    return soulNames;
  }

  async isAvailable(soulName: string): Promise<boolean> {
    let available = false;
    if (soulName && soulName.length > 0) {
      available = await this.identity.SoulNameContract.isAvailable(soulName);
    }
    return available;
  }

  // purchase only identity
  async purchaseIdentity(
    signer: ethers.Signer
  ): Promise<ethers.ContractTransaction> {
    return this.identity.SoulStoreContract.connect(signer).purchaseIdentity();
  }

  // purchase only identity with name
  async purchaseIdentityAndName(
    signer: ethers.Signer,
    paymentMethod: PaymentMethod,
    name: string,
    nameLength: number,
    duration = 1,
    metadataURL: string,
    authorityAddress: string,
    signature: string,
    debug = false
  ): Promise<ethers.ContractTransaction> {
    const { price, paymentAddress } = await this.getPaymentInformation(
      signer,
      paymentMethod,
      nameLength,
      duration
    );

    await this.checkOrGiveAllowance(
      paymentAddress,
      signer,

      paymentMethod,
      price
    );

    const params: [
      string, // paymentMethod: PromiseOrValue<string>
      string, // name: PromiseOrValue<string>
      BigNumberish, // nameLength: PromiseOrValue<BigNumberish>
      BigNumberish, // yearsPeriod: PromiseOrValue<BigNumberish>
      string, // tokenURI: PromiseOrValue<string>
      string, // authorityAddress: PromiseOrValue<string>
      BytesLike //signature: PromiseOrValue<BytesLike>
    ] = [
      paymentAddress,
      name,
      nameLength,
      duration,
      metadataURL,
      authorityAddress,
      signature,
    ];

    const overrides = {
      value: paymentMethod === "eth" ? price : undefined,
    };

    if (debug) {
      console.log("purchaseIdentityAndName", params, overrides);
    }

    const gasLimit =
      await this.identity.SoulStoreContract.estimateGas.purchaseIdentityAndName(
        ...params,
        overrides
      );

    const tx = await this.identity.SoulStoreContract.connect(
      signer
    ).purchaseIdentityAndName(...params, { ...overrides, gasLimit });
    return tx;
  }

  // purchase only name
  async purchaseName(
    signer: ethers.Signer,
    paymentMethod: PaymentMethod,
    name: string,
    nameLength: number,
    duration = 1,
    metadataURL: string,
    authorityAddress: string,
    signature: string,
    debug = false
  ): Promise<ethers.ContractTransaction> {
    const { price, paymentAddress } = await this.getPaymentInformation(
      signer,
      paymentMethod,
      nameLength,
      duration
    );

    await this.checkOrGiveAllowance(
      paymentAddress,
      signer,

      paymentMethod,
      price
    );

    const params: [
      string, // paymentMethod: PromiseOrValue<string>
      string, // to: PromiseOrValue<string>
      string, // name: PromiseOrValue<string>
      BigNumberish, // nameLength: PromiseOrValue<BigNumberish>
      BigNumberish, // yearsPeriod: PromiseOrValue<BigNumberish>
      string, // tokenURI: PromiseOrValue<string>
      string, // authorityAddress: PromiseOrValue<string>
      BytesLike // signature: PromiseOrValue<BytesLike>
    ] = [
      paymentAddress,
      await signer.getAddress(),
      name,
      nameLength,
      duration,
      metadataURL,
      authorityAddress,
      signature,
    ];

    const overrides = {
      value: paymentMethod === "eth" ? price : undefined,
    };

    if (debug) {
      console.log("purchaseName", params, overrides);
    }

    const gasLimit =
      await this.identity.SoulStoreContract.estimateGas.purchaseName(
        ...params,
        overrides
      );

    const tx = await this.identity.SoulStoreContract.connect(
      signer
    ).purchaseName(...params, { ...overrides, gasLimit });

    return tx;
  }

  private async checkOrGiveAllowance(
    paymentAddress: string,
    signer: ethers.Signer,
    paymentMethod: PaymentMethod,
    price: BigNumber
  ): Promise<ethers.ContractReceipt | undefined> {
    if (paymentMethod !== "eth") {
      const contract = IERC20__factory.connect(paymentAddress, signer);

      if (
        (await contract.allowance(
          // owner
          await signer.getAddress(),
          // spender
          this.identity.SoulStoreContract.address
        )) < price
      ) {
        const tx: ethers.ContractTransaction = await contract
          .connect(signer)
          .approve(
            // spender
            this.identity.SoulStoreContract.address,
            // amount
            price
          );

        return await tx.wait();
      }
    }
  }

  async getPaymentInformation(
    signer: ethers.Signer,
    paymentMethod: PaymentMethod,
    nameLength: number,
    duration = 1,
    // slippage in bps where 10000 is 100%. 250 would be 2,5%
    slippage: number | undefined = 250
  ): Promise<{
    price: BigNumber;
    paymentAddress: string;
    formattedPrice: string;
  }> {
    const paymentAddress = this.getPaymentAddress(paymentMethod);
    let price = await this.identity.SoulStoreContract.getPriceForMintingName(
      paymentAddress,
      nameLength,
      duration
    );

    if (slippage) {
      if (paymentMethod === "eth") {
        price = price.add(price.mul(slippage).div(10000));
      }
    }

    let decimals = 18;
    if (paymentAddress !== ethers.constants.AddressZero) {
      const contract = ERC20__factory.connect(paymentAddress, signer);
      decimals = await contract.decimals();
    }

    const formattedPrice = ethers.utils.formatUnits(price, decimals);

    return {
      price,
      paymentAddress,
      formattedPrice,
    };
  }

  // purchase only identity
  async mintCreditScore(
    wallet: ethers.Wallet,
    paymentMethod: PaymentMethod,
    identityId: BigNumber,
    authorityAddress: string,
    signatureDate: number,
    signature: string,
    slippage: number | undefined = 250
  ): Promise<ethers.ContractTransaction> {
    const types = {
      MintCreditScore: [
        { name: "identityId", type: "uint256" },
        { name: "authorityAddress", type: "address" },
        { name: "signatureDate", type: "uint256" },
      ],
    };

    const value = {
      identityId,
      authorityAddress,
      signatureDate,
    };

    const domain = await generateSignatureDomain(
      wallet,
      "SoulboundCreditScore",
      this.identity.SoulboundCreditScoreContract.address
    );

    const recoveredAddress = verifyTypedData(domain, types, value, signature);
    console.log({ recoveredAddress, authorityAddress });

    const paymentAddress = this.getPaymentAddress(paymentMethod);

    let price = await this.identity.SoulboundCreditScoreContract.getMintPrice(
      paymentAddress
    );

    if (slippage) {
      if (paymentMethod === "eth") {
        price = price.add(price.mul(slippage).div(10000));
      }
    }

    return await this.identity.SoulboundCreditScoreContract.connect(wallet)[
      "mint(address,uint256,address,uint256,bytes)"
    ](paymentAddress, identityId, authorityAddress, signatureDate, signature, {
      value: price,
    });
  }
}
