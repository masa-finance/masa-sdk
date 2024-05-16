import { BigNumber } from "@ethersproject/bignumber";

import { Messages } from "../../collections";
import type { BaseResult } from "../../interface";
import { MasaSBTModuleBase } from "./sbt/masa-sbt-module-base";

export class Green extends MasaSBTModuleBase {
  /**
   *
   * @param greenId
   */
  public burn = async (greenId: BigNumber): Promise<BaseResult> => {
    const result: BaseResult = {
      success: false,
    };

    console.log(`Burning Green with ID '${greenId}'!`);

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

      console.log(
        Messages.WaitingToFinalize(
          hash,
          this.masa.config.network?.blockExplorerUrls?.[0],
        ),
      );

      await wait();

      console.log(`Burned Green with ID '${greenId}'!`);
      result.success = true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        result.message = `Burning Green Failed! '${error.message}'`;
        console.error(result.message);
      }
    }

    return result;
  };
}
