import type { FeeData } from "@ethersproject/abstract-provider";
import { BigNumber } from "@ethersproject/bignumber";
import type {
  MasaSBT,
  MasaSBTAuthority,
  MasaSBTSelfSovereign,
  SoulLinker,
  SoulStore,
} from "@masa-finance/masa-contracts-identity";
import type { PayableOverrides, TypedDataDomain, TypedDataField } from "ethers";
import { constants, utils } from "ethers";
import { verifyTypedData } from "ethers/lib/utils";

import { BaseErrorCodes, Messages } from "../../collections";
import type {
  BaseResult,
  IIdentityContracts,
  MasaInterface,
  PaymentMethod,
} from "../../interface";
import { MasaBase } from "../../masa-base";
import type { ERC20 } from "../../stubs";
import { ERC20__factory } from "../../stubs";
import { isERC20Currency, isNativeCurrency, logger } from "../../utils";
import { parseEthersError } from "./ethers";

const DEFAULT_GAS_LIMIT: number = 750_000;

export abstract class MasaModuleBase extends MasaBase {
  constructor(
    masa: MasaInterface,
    protected instances: IIdentityContracts,
  ) {
    super(masa);
  }

  /**
   * Checks or gives allowance on ERC20 tokens
   * @param paymentAddress
   * @param paymentMethod
   * @param spenderAddress
   * @param price
   * @private
   */
  protected checkOrGiveAllowance = async (
    paymentAddress: string,
    paymentMethod: PaymentMethod,
    spenderAddress: string,
    price: BigNumber,
  ): Promise<BaseResult> => {
    const result: BaseResult = {
      success: false,
      errorCode: BaseErrorCodes.UnknownError,
    };

    if (isERC20Currency(paymentMethod)) {
      const tokenContract: ERC20 = ERC20__factory.connect(
        paymentAddress,
        this.masa.config.signer,
      );

      // get current allowance
      const currentAllowance = await tokenContract.allowance(
        // owner
        await this.masa.config.signer.getAddress(),
        // spender
        spenderAddress,
      );

      // is price greater the allowance?
      if (price.gt(currentAllowance)) {
        // yes, lets set the allowance to the price

        if (this.masa.config.verbose) {
          logger(
            "info",
            `Creating allowance for ${spenderAddress}: ${price.toString()}`,
          );
        }

        const {
          approve,
          estimateGas: { approve: estimateGas },
        } = tokenContract;

        try {
          const gasLimit = await this.estimateGasWithSlippage(estimateGas, [
            spenderAddress,
            price,
          ]);

          const { wait, hash } = await approve(
            // spender
            spenderAddress,
            // amount
            price,
            { gasLimit },
          );

          if (this.masa.config.verbose) {
            logger(
              "info",
              Messages.WaitingToFinalize(
                hash,
                this.masa.config.network?.blockExplorerUrls?.[0],
              ),
            );
          }

          await wait();

          result.success = true;
          delete result.errorCode;
        } catch (error: unknown) {
          result.message = "Approve failed! ";

          const { message, errorCode } = parseEthersError(error);

          result.message += message;
          result.errorCode = errorCode;

          logger("error", result);
        }
      }
    }

    return result;
  };

  /**
   * Gets the payment address for a given payment method
   * @param paymentMethod
   * @private
   */
  protected getPaymentAddress = (paymentMethod: PaymentMethod): string => {
    let paymentAddress: string | undefined = isNativeCurrency(paymentMethod)
      ? constants.AddressZero
      : this.masa.config.network?.addresses?.tokens?.[paymentMethod];

    if (!paymentAddress) {
      logger(
        "error",
        `Payment address not found for payment method: ${paymentMethod} falling back to native currency!`,
      );
      paymentAddress = constants.AddressZero;
    }

    return paymentAddress;
  };

  /**
   *
   * @param value
   */
  protected createOverrides = async (
    value?: BigNumber,
  ): Promise<PayableOverrides> => {
    const feeData: FeeData | undefined = this.masa.config.network?.skipEip1559
      ? undefined
      : await this.getNetworkFeeInformation();

    return {
      value,
      ...(feeData?.maxPriorityFeePerGas
        ? {
            maxPriorityFeePerGas: BigNumber.from(feeData.maxPriorityFeePerGas),
          }
        : undefined),
      ...(feeData?.maxFeePerGas
        ? {
            maxFeePerGas: BigNumber.from(feeData.maxFeePerGas),
          }
        : undefined),
    };
  };

  /**
   *
   */
  protected getNetworkFeeInformation = async (): Promise<
    FeeData | undefined
  > => {
    let feeData;

    try {
      feeData = await this.masa.config.signer.provider?.getFeeData();

      if (this.masa.config.verbose) {
        logger("dir", { networkFeeInformation: feeData });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger("warn", `Unable to get network fee data! ${error.message}`);
      }
    }

    return feeData;
  };

  /**
   *
   * @param paymentAddress
   * @param price
   */
  protected formatPrice = async (
    paymentAddress: string,
    price: BigNumber,
  ): Promise<string> => {
    let decimals = 18;
    if (paymentAddress !== constants.AddressZero) {
      const contract: ERC20 = ERC20__factory.connect(
        paymentAddress,
        this.masa.config.signer,
      );
      decimals = await contract.decimals();
    }

    return utils.formatUnits(price, decimals);
  };

  /**
   * adds a percentage to the price as slippage
   * @param price
   * @param slippage
   */
  protected static addSlippage = (
    price: BigNumber,
    slippage: number,
  ): BigNumber => {
    price = price.add(price.mul(slippage).div(10000));
    return price;
  };

  /**
   *
   * @param estimateGas
   * @param args
   * @param overrides
   */
  protected estimateGasWithSlippage = async (
    estimateGas: (...estimateGasArgAndOverrides: never[]) => Promise<BigNumber>,
    args?: unknown[],
    overrides?: PayableOverrides,
  ): Promise<BigNumber> => {
    let gasLimit: BigNumber;

    try {
      gasLimit = await (overrides && args
        ? estimateGas(...(args as never[]), overrides as never)
        : args
          ? estimateGas(...(args as never[]))
          : estimateGas());

      if (this.masa.config.network?.gasSlippagePercentage) {
        gasLimit = MasaModuleBase.addSlippage(
          gasLimit,
          this.masa.config.network.gasSlippagePercentage,
        );
      }
    } catch (error: unknown) {
      let message = "Estimate gas failed! ";

      const { message: ethersMessage, errorCode } = parseEthersError(error);

      message += ethersMessage;

      logger("error", {
        success: false,
        message,
        errorCode,
      });

      if (this.masa.config.forceTransactions) {
        // don't throw if we force this
        logger(
          "warn",
          `Forcing transaction for ${DEFAULT_GAS_LIMIT.toLocaleString()} gas!`,
        );
        gasLimit = BigNumber.from(DEFAULT_GAS_LIMIT);
      } else {
        throw error;
      }
    }

    return gasLimit;
  };

  /**
   * verify a signature created during one of the SBT signing flows
   * @param errorMessage
   * @param domain
   * @param contract
   * @param types
   * @param value
   * @param signature
   * @param authorityAddress
   */
  protected verify = async (
    errorMessage: string,
    contract:
      | MasaSBT
      | MasaSBTSelfSovereign
      | MasaSBTAuthority
      | SoulStore
      | SoulLinker,
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, string | BigNumber | number | boolean>,
    signature: string,
    authorityAddress: string,
  ): Promise<void> => {
    if (this.masa.config.verbose) {
      logger("dir", {
        domain,
        types: JSON.stringify(types),
        value,
        signature,
        authorityAddress,
      });
    }

    const hasAuthorities = (
      contract:
        | MasaSBT
        | MasaSBTSelfSovereign
        | MasaSBTAuthority
        | SoulStore
        | SoulLinker,
    ): contract is MasaSBTSelfSovereign => {
      return (contract as MasaSBTSelfSovereign).authorities !== undefined;
    };

    // first line of defense, check that the address properly recovers
    const recoveredAddress = verifyTypedData(domain, types, value, signature);

    if (this.masa.config.verbose) {
      logger("dir", {
        recoveredAddress,
        authorityAddress,
      });
    }

    // if this fails we throw
    if (recoveredAddress !== authorityAddress) {
      throw new Error(`${errorMessage}: Signature Verification failed!`);
    }

    // second line of defense, if the contract supports authorities
    if (hasAuthorities(contract)) {
      let recoveredAddressIsAuthority = false;

      try {
        recoveredAddressIsAuthority =
          await contract.authorities(recoveredAddress);
      } catch (error: unknown) {
        if (error instanceof Error)
          logger("error", `Retrieving authorities failed! ${error.message}.`);
      }

      if (this.masa.config.verbose) {
        logger("dir", { recoveredAddressIsAuthority });
      }

      // we check that the recovered address is within the authorities
      if (!recoveredAddressIsAuthority) {
        throw new Error(
          `${errorMessage}: Authority '${recoveredAddress}' not allowed!`,
        );
      }
    }
  };
}
