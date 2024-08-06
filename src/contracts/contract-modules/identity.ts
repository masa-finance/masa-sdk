import { BigNumber } from "ethers";

import { Messages } from "../../collections";
import type { BaseResult } from "../../interface";
import { MasaSBTModuleBase } from "./sbt/masa-sbt-module-base";

export class Identity extends MasaSBTModuleBase {
  /**
   *
   * @param identityId
   */
  public burn = async (identityId: BigNumber): Promise<BaseResult> => {
    const result: BaseResult = { success: false };

    console.log(`Burning Identity with ID '${identityId}'!`);

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

      console.log(
        Messages.WaitingToFinalize(
          hash,
          this.masa.config.network?.blockExplorerUrls?.[0],
        ),
      );

      await wait();

      console.log(`Burned Identity with ID '${identityId}'!`);
      result.success = true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        result.message = `Burning Identity Failed! ${error.message}`;
        console.error(result.message);
      }
    }

    return result;
  };
}
