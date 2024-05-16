import { BigNumber } from "@ethersproject/bignumber";

import { Messages } from "../../collections";
import type { BaseResult } from "../../interface";
import { MasaSBTModuleBase } from "./sbt/masa-sbt-module-base";

export class CreditScore extends MasaSBTModuleBase {
  /**
   *
   * @param creditScoreId
   */
  public burn = async (creditScoreId: BigNumber): Promise<BaseResult> => {
    const result: BaseResult = {
      success: false,
    };

    console.log(`Burning Credit Score with ID '${creditScoreId}'!`);

    const {
      estimateGas: { burn: estimateGas },
      burn,
    } = this.masa.contracts.instances.SoulboundCreditScoreContract;

    try {
      const gasLimit = await this.estimateGasWithSlippage(estimateGas, [
        creditScoreId,
      ]);

      const { wait, hash } = await burn(creditScoreId, {
        gasLimit,
      });

      console.log(
        Messages.WaitingToFinalize(
          hash,
          this.masa.config.network?.blockExplorerUrls?.[0],
        ),
      );

      await wait();

      console.log(`Burned Credit Score with ID '${creditScoreId}'!`);
      result.success = true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        result.message = `Burning Credit Score Failed! '${error.message}'`;
        console.error(result.message);
      }
    }

    return result;
  };
}
