import { BigNumber } from "@ethersproject/bignumber";
import { ContractTransaction, TypedDataDomain } from "ethers";

import { isNativeCurrency, PaymentMethod } from "../../interface";
import { generateSignatureDomain, Messages, signTypedData } from "../../utils";
import { MasaModuleBase } from "./masa-module-base";

export class SoulName extends MasaModuleBase {
  /**
   *
   */
  types = {
    MintSoulName: [
      { name: "to", type: "address" },
      { name: "name", type: "string" },
      { name: "nameLength", type: "uint256" },
      { name: "yearsPeriod", type: "uint256" },
      { name: "tokenURI", type: "string" },
    ],
  };

  /**
   * Check if a soul name is available
   * @param soulName
   */
  isAvailable = async (soulName: string): Promise<boolean> => {
    let available = false;
    if (soulName && soulName.length > 0) {
      available = await this.instances.SoulNameContract.isAvailable(soulName);
    }
    return available;
  };

  /**
   * purchase only name
   * @param paymentMethod
   * @param name
   * @param nameLength
   * @param duration
   * @param metadataURL
   * @param authorityAddress
   * @param signature
   * @param receiver
   */
  purchase = async (
    paymentMethod: PaymentMethod,
    name: string,
    nameLength: number,
    duration: number = 1,
    metadataURL: string,
    authorityAddress: string,
    signature: string,
    receiver?: string
  ): Promise<ContractTransaction> => {
    const to = receiver || (await this.masa.config.signer.getAddress());

    const domain: TypedDataDomain = await generateSignatureDomain(
      this.masa.config.signer,
      "SoulStore",
      this.instances.SoulStoreContract.address
    );

    const value: {
      to: string;
      name: string;
      nameLength: number;
      yearsPeriod: number;
      tokenURI: string;
    } = {
      to,
      name,
      nameLength,
      yearsPeriod: duration,
      tokenURI: metadataURL,
    };

    await this.verify(
      "Verifying soul name failed!",
      this.instances.SoulStoreContract,
      domain,
      this.types,
      value,
      signature,
      authorityAddress
    );

    const { price, paymentAddress } = await this.getPrice(
      paymentMethod,
      nameLength,
      duration
    );

    await this.checkOrGiveAllowance(
      paymentAddress,
      paymentMethod,
      this.instances.SoulStoreContract.address,
      price
    );

    const purchaseNameParameters: [
      string, // paymentMethod: PromiseOrValue<string>
      string, // to: PromiseOrValue<string>
      string, // name: PromiseOrValue<string>
      number, // nameLength: PromiseOrValue<BigNumberish>
      number, // yearsPeriod: PromiseOrValue<BigNumberish>
      string, // tokenURI: PromiseOrValue<string>
      string, // authorityAddress: PromiseOrValue<string>
      string // signature: PromiseOrValue<BytesLike>
    ] = [
      paymentAddress,
      to,
      name,
      nameLength,
      duration,
      metadataURL,
      authorityAddress,
      signature,
    ];

    const purchaseNameOverrides = {
      value: isNativeCurrency(paymentMethod) ? price : undefined,
    };

    if (this.masa.config.verbose) {
      console.log({ purchaseNameParameters, purchaseNameOverrides });
    }

    // connect
    const {
      estimateGas: { purchaseName: estimateGas },
      purchaseName,
    } = this.instances.SoulStoreContract.connect(this.masa.config.signer);

    // estimate gas
    let gasLimit: BigNumber = await estimateGas(
      ...purchaseNameParameters,
      purchaseNameOverrides
    );

    if (this.masa.config.network?.gasSlippagePercentage) {
      gasLimit = this.addSlippage(
        gasLimit,
        this.masa.config.network.gasSlippagePercentage
      );
    }

    // execute
    return await purchaseName(...purchaseNameParameters, {
      ...purchaseNameOverrides,
      gasLimit,
    });
  };

  /**
   * Get price for minting a soul name
   * @param paymentMethod
   * @param nameLength
   * @param duration
   * @param slippage
   */
  getPrice = async (
    paymentMethod: PaymentMethod,
    nameLength: number,
    duration: number = 1,
    // slippage in bps where 10000 is 100%. 250 would be 2,5%
    slippage: number | undefined = 250
  ): Promise<{
    paymentAddress: string;
    price: BigNumber;
    formattedPrice: string;
    mintFee: BigNumber;
    formattedMintFee: string;
    protocolFee: BigNumber;
    formattedProtocolFee: string;
  }> => {
    const paymentAddress = this.getPaymentAddress(paymentMethod);

    let mintFee: BigNumber | undefined,
      protocolFee: BigNumber = BigNumber.from(0);
    try {
      // load protocol and mint fee
      const fees =
        await this.instances.SoulStoreContract.getPriceForMintingNameWithProtocolFee(
          paymentAddress,
          nameLength,
          duration
        );
      mintFee = fees.price;
      protocolFee = fees.protocolFee;
    } catch {
      // ignore this is a soul store 2.0 function and does not work on older contracts
    }

    if (!mintFee) {
      // fallback to classical price calculation
      mintFee = await this.instances.SoulStoreContract.getPriceForMintingName(
        paymentAddress,
        nameLength,
        duration
      );
    }

    // calculate total price
    let price = mintFee.add(protocolFee);

    if (slippage) {
      if (isNativeCurrency(paymentMethod)) {
        price = this.addSlippage(price, slippage);
      }
    }

    // total price
    const formattedPrice = await this.formatPrice(paymentAddress, price);

    // mint fee
    const formattedMintFee = await this.formatPrice(paymentAddress, mintFee);

    // protocol fee
    const formattedProtocolFee = await this.formatPrice(
      paymentAddress,
      protocolFee
    );

    return {
      paymentAddress,
      price,
      formattedPrice,
      mintFee,
      formattedMintFee,
      protocolFee,
      formattedProtocolFee,
    };
  };

  /**
   * Returns detailed information for a soul name
   * @param soulName
   */
  getSoulnameData = async (
    soulName: string
  ): Promise<{ exists: boolean; tokenId: BigNumber }> => {
    return await this.instances.SoulNameContract.nameData(
      soulName.toLowerCase()
    );
  };

  /**
   * signs a soul name
   * @param soulName
   * @param soulNameLength
   * @param duration
   * @param metadataUrl
   * @param receiver
   */
  sign = async (
    soulName: string,
    soulNameLength: number,
    duration: number,
    metadataUrl: string,
    receiver: string
  ): Promise<
    | {
        signature: string;
        authorityAddress: string;
      }
    | undefined
  > => {
    const value: {
      to: string;
      name: string;
      nameLength: number;
      yearsPeriod: number;
      tokenURI: string;
    } = {
      to: receiver,
      name: soulName,
      nameLength: soulNameLength,
      yearsPeriod: duration,
      tokenURI: metadataUrl,
    };

    const { signature, domain } = await signTypedData(
      this.instances.SoulStoreContract,
      this.masa.config.signer,
      "SoulStore",
      this.types,
      value
    );

    const authorityAddress = await this.masa.config.signer.getAddress();

    await this.verify(
      "Signing soul name failed!",
      this.instances.SoulStoreContract,
      domain,
      this.types,
      value,
      signature,
      authorityAddress
    );

    return { signature, authorityAddress };
  };

  /**
   *
   * @param soulName
   * @param receiver
   */
  transfer = async (soulName: string, receiver: string): Promise<boolean> => {
    const [soulNameData, extension] = await Promise.all([
      this.getSoulnameData(soulName),
      this.masa.contracts.instances.SoulNameContract.extension(),
    ]);

    if (soulNameData.exists) {
      console.log(
        `Sending '${soulName}${extension}' with token ID '${soulNameData.tokenId}' to '${receiver}'!`
      );

      try {
        const { transferFrom } =
          this.masa.contracts.instances.SoulNameContract.connect(
            this.masa.config.signer
          );

        const { wait, hash } = await transferFrom(
          this.masa.config.signer.getAddress(),
          receiver,
          soulNameData.tokenId
        );

        console.log(Messages.WaitingToFinalize(hash));
        await wait();

        console.log(
          `Soulname '${soulName}${extension}' with token ID '${soulNameData.tokenId}' sent!`
        );

        return true;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(`Sending of Soul Name Failed! ${error.message}`);
        }
      }
    } else {
      console.error(`Soulname '${soulName}${extension}' does not exist!`);
    }

    return false;
  };

  /**
   *
   * @param soulName
   */
  burn = async (soulName: string): Promise<boolean> => {
    const [soulNameData, extension] = await Promise.all([
      this.getSoulnameData(soulName),
      this.masa.contracts.instances.SoulNameContract.extension(),
    ]);

    if (soulNameData.exists) {
      console.log(
        `Burning '${soulName}${extension}' with token ID '${soulNameData.tokenId}'!`
      );

      try {
        const {
          estimateGas: { burn: estimateGas },
          burn,
        } = this.masa.contracts.instances.SoulNameContract.connect(
          this.masa.config.signer
        );

        // estimate gas
        let gasLimit: BigNumber = await estimateGas(soulNameData.tokenId);

        if (this.masa.config.network?.gasSlippagePercentage) {
          gasLimit = this.addSlippage(
            gasLimit,
            this.masa.config.network.gasSlippagePercentage
          );
        }

        const { wait, hash } = await burn(soulNameData.tokenId, {
          gasLimit,
        });

        console.log(Messages.WaitingToFinalize(hash));
        await wait();

        console.log(
          `Burned Soulname '${soulName}${extension}' with ID '${soulNameData.tokenId}'!`
        );

        return true;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(
            `Burning Soulname '${soulName}${extension}' Failed! ${error.message}`
          );
        }
      }
    } else {
      console.error(`Soulname '${soulName}${extension}' does not exist!`);
    }

    return false;
  };
}
