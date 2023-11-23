import { MasaSBT } from "@masa-finance/masa-contracts-identity";
import { BigNumber } from "ethers";

import { Messages } from "../../../../collections";
import type {
  BaseResult,
  IIdentityContracts,
  MasaInterface,
  PaymentMethod,
  PriceInformation,
} from "../../../../interface";
import { MasaSBTModuleBase } from "../masa-sbt-module-base";

export class SBTContractWrapper<
  Contract extends MasaSBT,
> extends MasaSBTModuleBase {
  constructor(
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
    const result: BaseResult = { success: false };

    const {
      estimateGas: { burn: estimateGas },
      burn,
    } = this.contract;

    try {
      const gasLimit = await this.estimateGasWithSlippage(estimateGas, [
        tokenId,
      ]);

      const { wait, hash } = await burn(tokenId, { gasLimit });

      console.log(
        Messages.WaitingToFinalize(
          hash,
          this.masa.config.network?.blockExplorerUrls?.[0],
        ),
      );

      await wait();

      result.success = true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        result.message = `Burning SBT Failed! '${error.message}'`;
        console.error(result.message);
      }
    }

    return result;
  };
}
