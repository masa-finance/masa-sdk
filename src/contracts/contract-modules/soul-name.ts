import { BigNumber } from "@ethersproject/bignumber";
import type {
  ContractTransaction,
  PayableOverrides,
  TypedDataDomain,
} from "ethers";
import { TypedDataField } from "ethers";

import { BaseErrorCodes, Messages } from "../../collections";
import type {
  BaseResult,
  PaymentMethod,
  PriceInformation,
} from "../../interface";
import {
  generateSignatureDomain,
  isNativeCurrency,
  signTypedData,
} from "../../utils";
import { MasaModuleBase } from "./masa-module-base";

export class SoulName extends MasaModuleBase {
  /**
   *
   */
  public readonly types: Record<string, Array<TypedDataField>> = {
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
  public isAvailable = async (soulName: string): Promise<boolean> => {
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
  public purchase = async (
    paymentMethod: PaymentMethod,
    name: string,
    nameLength: number,
    duration: number = 1,
    metadataURL: string,
    authorityAddress: string,
    signature: string,
    receiver?: string,
  ): Promise<ContractTransaction> => {
    const to = receiver || (await this.masa.config.signer.getAddress());

    const domain: TypedDataDomain = await generateSignatureDomain(
      this.masa.config.signer,
      "SoulStore",
      this.instances.SoulStoreContract.address,
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
      authorityAddress,
    );

    const { price, paymentAddress } = await this.getPrice(
      paymentMethod,
      nameLength,
      duration,
    );

    await this.checkOrGiveAllowance(
      paymentAddress,
      paymentMethod,
      this.instances.SoulStoreContract.address,
      price,
    );

    const purchaseNameParameters: [
      string, // paymentMethod: PromiseOrValue<string>
      string, // to: PromiseOrValue<string>
      string, // name: PromiseOrValue<string>
      number, // nameLength: PromiseOrValue<BigNumberish>
      number, // yearsPeriod: PromiseOrValue<BigNumberish>
      string, // tokenURI: PromiseOrValue<string>
      string, // authorityAddress: PromiseOrValue<string>
      string, // signature: PromiseOrValue<BytesLike>
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

    const purchaseNameOverrides: PayableOverrides = await this.createOverrides(
      isNativeCurrency(paymentMethod) ? price : undefined,
    );

    if (this.masa.config.verbose) {
      console.log({ purchaseNameParameters, purchaseNameOverrides });
    }

    // connect
    const {
      estimateGas: { purchaseName: estimateGas },
      purchaseName,
    } = this.instances.SoulStoreContract;

    // estimate gas
    const gasLimit = await this.estimateGasWithSlippage(
      estimateGas,
      purchaseNameParameters,
      purchaseNameOverrides,
    );

    // execute
    return purchaseName(...purchaseNameParameters, {
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
  public getPrice = async (
    paymentMethod: PaymentMethod,
    nameLength: number,
    duration: number = 1,
    // slippage in bps where 10000 is 100%. 250 would be 2,5%
    slippage: number | undefined = 250,
  ): Promise<PriceInformation> => {
    const paymentAddress = this.getPaymentAddress(paymentMethod);

    let mintFee: BigNumber | undefined,
      protocolFee: BigNumber = BigNumber.from(0);

    try {
      // load protocol and mint fee
      const fees =
        await this.instances.SoulStoreContract.getPriceForMintingNameWithProtocolFee(
          paymentAddress,
          nameLength,
          duration,
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
        duration,
      );
    }

    // calculate total price
    let price = mintFee.add(protocolFee);

    if (slippage) {
      if (isNativeCurrency(paymentMethod)) {
        price = SoulName.addSlippage(price, slippage);
      }
    }

    // total price
    const formattedPrice = await this.formatPrice(paymentAddress, price);

    // mint fee
    const formattedMintFee = await this.formatPrice(paymentAddress, mintFee);

    // protocol fee
    const formattedProtocolFee = await this.formatPrice(
      paymentAddress,
      protocolFee,
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
  public getSoulnameData = async (
    soulName: string,
  ): Promise<{ exists: boolean; tokenId: BigNumber }> => {
    return await this.instances.SoulNameContract.nameData(
      soulName.toLowerCase(),
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
  public sign = async (
    soulName: string,
    soulNameLength: number,
    duration: number,
    metadataUrl: string,
    receiver: string,
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

    const { signature, domain } = await signTypedData({
      contract: this.instances.SoulStoreContract,
      signer: this.masa.config.signer,
      name: "SoulStore",
      types: this.types,
      value,
    });

    const authorityAddress = await this.masa.config.signer.getAddress();

    await this.verify(
      "Signing soul name failed!",
      this.instances.SoulStoreContract,
      domain,
      this.types,
      value,
      signature,
      authorityAddress,
    );

    return { signature, authorityAddress };
  };

  /**
   *
   * @param soulName
   * @param receiver
   */
  public transfer = async (
    soulName: string,
    receiver: string,
  ): Promise<BaseResult> => {
    const result: BaseResult = {
      success: false,
      errorCode: BaseErrorCodes.UnknownError,
    };

    const [soulNameData, extension] = await Promise.all([
      this.getSoulnameData(soulName),
      this.masa.contracts.instances.SoulNameContract.extension(),
    ]);

    if (soulNameData.exists) {
      console.log(
        `Sending '${soulName}${extension}' with token ID '${soulNameData.tokenId}' to '${receiver}'!`,
      );

      const {
        transferFrom,
        estimateGas: { transferFrom: estimateGas },
      } = this.masa.contracts.instances.SoulNameContract;

      try {
        const transferFromArguments: [string, string, BigNumber] = [
          await this.masa.config.signer.getAddress(),
          receiver,
          soulNameData.tokenId,
        ];

        const gasLimit = await this.estimateGasWithSlippage(
          estimateGas,
          transferFromArguments,
        );

        const { wait, hash } = await transferFrom(...transferFromArguments, {
          gasLimit,
        });

        console.log(
          Messages.WaitingToFinalize(
            hash,
            this.masa.config.network?.blockExplorerUrls?.[0],
          ),
        );

        await wait();

        console.log(
          `Soulname '${soulName}${extension}' with token ID '${soulNameData.tokenId}' sent!`,
        );

        result.success = true;
        delete result.errorCode;
      } catch (error: unknown) {
        if (error instanceof Error) {
          result.message = `Sending of Soul Name Failed! ${error.message}`;
          console.error(result.message);
        }
      }
    } else {
      result.message = `Soulname '${soulName}${extension}' does not exist!`;
      console.error(result.message);
    }

    return result;
  };

  /**
   *
   * @param soulName
   */
  public burn = async (soulName: string): Promise<BaseResult> => {
    const result: BaseResult = {
      success: false,
      errorCode: BaseErrorCodes.UnknownError,
    };

    const [soulNameData, extension] = await Promise.all([
      this.getSoulnameData(soulName),
      this.masa.contracts.instances.SoulNameContract.extension(),
    ]);

    if (soulNameData.exists) {
      console.log(
        `Burning '${soulName}${extension}' with token ID '${soulNameData.tokenId}'!`,
      );

      const {
        estimateGas: { burn: estimateGas },
        burn,
      } = this.masa.contracts.instances.SoulNameContract;

      try {
        // estimate gas
        const gasLimit = await this.estimateGasWithSlippage(estimateGas, [
          soulNameData.tokenId,
        ]);

        const { wait, hash } = await burn(soulNameData.tokenId, {
          gasLimit,
        });

        console.log(
          Messages.WaitingToFinalize(
            hash,
            this.masa.config.network?.blockExplorerUrls?.[0],
          ),
        );

        await wait();

        console.log(
          `Burned Soulname '${soulName}${extension}' with ID '${soulNameData.tokenId}'!`,
        );

        result.success = true;
        delete result.errorCode;
      } catch (error: unknown) {
        if (error instanceof Error) {
          result.message = `Burning Soulname '${soulName}${extension}' Failed! ${error.message}`;
          console.error(result.message);
        }
      }
    } else {
      result.message = `Soulname '${soulName}${extension}' does not exist!`;
      console.error(result.message);
    }

    return result;
  };

  /**
   *
   * @param soulName
   * @param years
   */
  public renew = async (
    soulName: string,
    years: number,
  ): Promise<BaseResult> => {
    const result: BaseResult = {
      success: false,
      errorCode: BaseErrorCodes.UnknownError,
    };

    const tokenId =
      await this.masa.contracts.instances.SoulNameContract.getTokenId(soulName);

    const {
      renewYearsPeriod,
      estimateGas: { renewYearsPeriod: estimateGas },
    } = this.masa.contracts.instances.SoulNameContract;

    try {
      const gasLimit = await this.estimateGasWithSlippage(estimateGas, [
        tokenId,
        years,
      ]);

      const { wait, hash } = await renewYearsPeriod(tokenId, years, {
        gasLimit,
      });

      console.log(
        Messages.WaitingToFinalize(
          hash,
          this.masa.config.network?.blockExplorerUrls?.[0],
        ),
      );

      await wait();

      result.success = true;
      delete result.errorCode;
    } catch (error: unknown) {
      if (error instanceof Error) {
        result.message = `renewal failed! ${error.message}`;
        console.error(result.message);
      }
    }

    return result;
  };
}
