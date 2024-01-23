import { MasaSBT } from "@masa-finance/masa-contracts-identity";
import { BigNumber } from "ethers";

import { BaseErrorCodes, Messages } from "../../../../collections";
import type {
  BaseResult,
  IIdentityContracts,
  MasaInterface,
  PaymentMethod,
  PriceInformation,
} from "../../../../interface";
import { logger } from "../../../../utils";
import { parseEthersError } from "../../ethers";
import { MasaSBTModuleBase } from "../masa-sbt-module-base";

export class SBTContractWrapper<
  Contract extends MasaSBT,
> extends MasaSBTModuleBase {
  public constructor(
    masa: MasaInterface,
    instances: IIdentityContracts,
    public readonly contract: Contract,
  ) {
    super(masa, instances);
  }

  /**
   *
   * @param paymentMethod
   * @param slippage
   */
  public getPrice = (
    paymentMethod: PaymentMethod,
    slippage: number | undefined = 250,
  ): Promise<PriceInformation> =>
    this.getMintPrice(paymentMethod, this.contract, slippage);

  /**
   *
   * @param tokenId
   */
  public burn = async (tokenId: BigNumber): Promise<BaseResult> => {
    const result: BaseResult = {
      success: false,
      errorCode: BaseErrorCodes.UnknownError,
    };

    const {
      estimateGas: { burn: estimateGas },
      burn,
    } = this.contract;

    try {
      const gasLimit = await this.estimateGasWithSlippage(estimateGas, [
        tokenId,
      ]);

      const { wait, hash } = await burn(tokenId, { gasLimit });

      logger(
        "log",
        Messages.WaitingToFinalize(
          hash,
          this.masa.config.network?.blockExplorerUrls?.[0],
        ),
      );

      await wait();

      result.success = true;
      delete result.errorCode;
    } catch (error: unknown) {
      result.message = "Burning SBT Failed! ";

      const { message, errorCode } = parseEthersError(error);
      result.message += message;
      result.errorCode = errorCode;

      logger("error", result);
    }

    return result;
  };
}
