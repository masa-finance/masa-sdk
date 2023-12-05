import {
  BigNumber,
  ContractTransaction,
  PayableOverrides,
  TypedDataDomain,
} from "ethers";

import { BaseErrorCodes, Messages } from "../../collections";
import type { BaseResult, PaymentMethod } from "../../interface";
import { generateSignatureDomain, isNativeCurrency, logger } from "../../utils";
import { parseEthersError } from "./ethers";
import { MasaSBTModuleBase } from "./sbt/masa-sbt-module-base";

export class Identity extends MasaSBTModuleBase {
  /**
   * purchase only identity
   */
  public purchase = async (): Promise<ContractTransaction> => {
    const {
      estimateGas: { purchaseIdentity: estimateGas },
      purchaseIdentity,
    } = this.instances.SoulStoreContract;

    // estimate gas
    const gasLimit = await this.estimateGasWithSlippage(estimateGas);

    return await purchaseIdentity({ gasLimit });
  };

  /**
   * purchase identity with name
   * @param paymentMethod
   * @param name
   * @param nameLength
   * @param duration
   * @param metadataURL
   * @param authorityAddress
   * @param signature
   */
  public purchaseIdentityAndName = async (
    paymentMethod: PaymentMethod,
    name: string,
    nameLength: number,
    duration: number = 1,
    metadataURL: string,
    authorityAddress: string,
    signature: string,
  ): Promise<ContractTransaction> => {
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
      to: await this.masa.config.signer.getAddress(),
      name,
      nameLength,
      yearsPeriod: duration,
      tokenURI: metadataURL,
    };

    await this.verify(
      "Verifying soul name failed!",
      this.instances.SoulStoreContract,
      domain,
      this.masa.contracts.soulName.types,
      value,
      signature,
      authorityAddress,
    );

    const { price, paymentAddress } =
      await this.masa.contracts.soulName.getPrice(
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

    const purchaseIdentityAndNameParameters: [
      string, // paymentMethod: PromiseOrValue<string>
      string, // name: PromiseOrValue<string>
      number, // nameLength: PromiseOrValue<BigNumberish>
      number, // yearsPeriod: PromiseOrValue<BigNumberish>
      string, // tokenURI: PromiseOrValue<string>
      string, // authorityAddress: PromiseOrValue<string>
      string, // signature: PromiseOrValue<BytesLike>
    ] = [
      paymentAddress,
      name,
      nameLength,
      duration,
      metadataURL,
      authorityAddress,
      signature,
    ];

    const purchaseIdentityAndNameOverrides: PayableOverrides =
      await this.createOverrides(
        isNativeCurrency(paymentMethod) ? price : undefined,
      );

    if (this.masa.config.verbose) {
      logger("dir", {
        purchaseIdentityAndNameParameters,
        purchaseIdentityAndNameOverrides,
      });
    }

    // connect
    const {
      estimateGas: { purchaseIdentityAndName: estimateGas },
      purchaseIdentityAndName,
    } = this.instances.SoulStoreContract;

    // estimate gas
    const gasLimit = await this.estimateGasWithSlippage(
      estimateGas,
      purchaseIdentityAndNameParameters,
      purchaseIdentityAndNameOverrides,
    );

    // execute tx
    return purchaseIdentityAndName(...purchaseIdentityAndNameParameters, {
      ...purchaseIdentityAndNameOverrides,
      gasLimit,
    });
  };

  /**
   *
   * @param identityId
   */
  public burn = async (identityId: BigNumber): Promise<BaseResult> => {
    const result: BaseResult = {
      success: false,
      errorCode: BaseErrorCodes.UnknownError,
    };

    logger("log", `Burning Identity with ID '${identityId}'!`);

    const {
      estimateGas: { burn: estimateGas },
      burn,
    } = this.masa.contracts.instances.SoulboundIdentityContract;

    try {
      // estimate gas
      const gasLimit = await this.estimateGasWithSlippage(estimateGas, [
        identityId,
      ]);

      const { wait, hash } = await burn(identityId, { gasLimit });

      logger(
        "log",
        Messages.WaitingToFinalize(
          hash,
          this.masa.config.network?.blockExplorerUrls?.[0],
        ),
      );

      await wait();

      logger("log", `Burned Identity with ID '${identityId}'!`);
      result.success = true;
      delete result.errorCode;
    } catch (error: unknown) {
      result.message = "Burning Identity Failed! ";

      const { message, errorCode } = parseEthersError(error);
      result.message += message;
      result.errorCode = errorCode;

      logger("error", result);
    }

    return result;
  };
}
