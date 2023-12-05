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
  logger,
  signTypedData,
} from "../../utils";
import { parseEthersError } from "./ethers";
import { MasaSBTModuleBase } from "./sbt/masa-sbt-module-base";

export class Green extends MasaSBTModuleBase {
  /**
   *
   */
  public readonly types: Record<string, Array<TypedDataField>> = {
    MintGreen: [
      { name: "to", type: "address" },
      { name: "authorityAddress", type: "address" },
      { name: "signatureDate", type: "uint256" },
    ],
  };

  /**
   * Gets the price for a masa green
   * @param paymentMethod
   * @param slippage
   */
  public getPrice = async (
    paymentMethod: PaymentMethod,
    slippage: number | undefined = 250,
  ): Promise<
    PriceInformation & {
      mintTransactionEstimatedGas: BigNumber;
      mintTransactionFee: BigNumber;
      formattedMintTransactionFee: string;
    }
  > => {
    const priceInformation = await this.getMintPrice(
      paymentMethod,
      this.instances.SoulboundGreenContract,
      slippage,
    );

    const gasPrice = await this.masa.config.signer.getGasPrice();

    // hardcoded estimation for now
    const mintTransactionEstimatedGas = BigNumber.from(250_000);
    const mintTransactionFee = gasPrice.mul(mintTransactionEstimatedGas);

    const formattedMintTransactionFee: string = await this.formatPrice(
      priceInformation.paymentAddress,
      mintTransactionFee,
    );

    return {
      ...priceInformation,
      mintTransactionEstimatedGas,
      mintTransactionFee,
      formattedMintTransactionFee,
    };
  };

  /**
   * Purchase a masa green
   * @param paymentMethod
   * @param receiver
   * @param authorityAddress
   * @param signatureDate
   * @param signature
   * @param slippage
   */
  public mint = async (
    paymentMethod: PaymentMethod,
    receiver: string,
    authorityAddress: string,
    signatureDate: number,
    signature: string,
    slippage: number | undefined = 250,
  ): Promise<ContractTransaction> => {
    const value: {
      to: string;
      authorityAddress: string;
      signatureDate: number;
    } = {
      to: receiver,
      authorityAddress,
      signatureDate,
    };

    const domain: TypedDataDomain = await generateSignatureDomain(
      this.masa.config.signer,
      "SoulboundGreen",
      this.instances.SoulboundGreenContract.address,
    );

    await this.verify(
      "Verifying green failed!",
      this.instances.SoulboundGreenContract,
      domain,
      this.types,
      value,
      signature,
      authorityAddress,
    );

    const { paymentAddress, price, formattedPrice, mintTransactionFee } =
      await this.getPrice(paymentMethod, slippage);

    if (this.masa.config.verbose) {
      logger("dir", {
        price: price.toString(),
        mintTransactionFee: mintTransactionFee.toString(),
        paymentAddress,
        formattedPrice,
      });
    }

    await this.checkOrGiveAllowance(
      paymentAddress,
      paymentMethod,
      this.instances.SoulboundGreenContract.address,
      price,
    );

    const greenMintParameters: [string, string, string, number, string] = [
      paymentAddress,
      await this.masa.config.signer.getAddress(),
      authorityAddress,
      signatureDate,
      signature,
    ];

    const greenMintOverrides: PayableOverrides = await this.createOverrides(
      isNativeCurrency(paymentMethod) ? price : undefined,
    );

    if (this.masa.config.verbose) {
      logger("dir", {
        greenMintParameters,
        greenMintOverrides,
      });
    }

    // connect
    const {
      estimateGas: {
        "mint(address,address,address,uint256,bytes)": estimateGas,
      },
      "mint(address,address,address,uint256,bytes)": mint,
    } = this.instances.SoulboundGreenContract;

    // estimate gas
    const gasLimit = await this.estimateGasWithSlippage(
      estimateGas,
      greenMintParameters,
      greenMintOverrides,
    );

    // execute
    return mint(...greenMintParameters, { ...greenMintOverrides, gasLimit });
  };

  /**
   * Signs a masa green
   * @param receiver
   */
  public sign = async (
    receiver: string,
  ): Promise<
    | {
        signature: string;
        signatureDate: number;
        authorityAddress: string;
      }
    | undefined
  > => {
    const signatureDate = Math.floor(Date.now() / 1000);

    const authorityAddress = await this.masa.config.signer.getAddress();
    const value: {
      to: string;
      authorityAddress: string;
      signatureDate: number;
    } = {
      to: receiver,
      authorityAddress,
      signatureDate,
    };

    const { signature, domain } = await signTypedData({
      contract: this.instances.SoulboundGreenContract,
      signer: this.masa.config.signer,
      name: "SoulboundGreen",
      types: this.types,
      value,
    });

    await this.verify(
      "Signing green failed!",
      this.instances.SoulboundGreenContract,
      domain,
      this.types,
      value,
      signature,
      authorityAddress,
    );

    return { signature, signatureDate, authorityAddress };
  };

  /**
   *
   * @param greenId
   */
  public burn = async (greenId: BigNumber): Promise<BaseResult> => {
    const result: BaseResult = {
      success: false,
      errorCode: BaseErrorCodes.UnknownError,
    };

    logger("log", `Burning Green with ID '${greenId}'!`);

    const {
      estimateGas: { burn: estimateGas },
      burn,
    } = this.masa.contracts.instances.SoulboundGreenContract;

    try {
      const gasLimit = await this.estimateGasWithSlippage(estimateGas, [
        greenId,
      ]);

      const { wait, hash } = await burn(greenId, {
        gasLimit,
      });

      logger(
        "log",
        Messages.WaitingToFinalize(
          hash,
          this.masa.config.network?.blockExplorerUrls?.[0],
        ),
      );

      await wait();

      logger("log", `Burned Green with ID '${greenId}'!`);
      result.success = true;
      delete result.errorCode;
    } catch (error: unknown) {
      result.message = "Burning Green Failed! ";

      const { message, errorCode } = parseEthersError(error);

      result.message += message;
      result.errorCode = errorCode;

      logger("error", result);
    }

    return result;
  };
}
