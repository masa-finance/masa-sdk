import { BigNumber } from "ethers";

import { Messages } from "../../collections";
import type { BaseResult } from "../../interface";
import { MasaModuleBase } from "./masa-module-base";

export class Marketplace extends MasaModuleBase {
  public stake = async (
    tokenId: BigNumber,
    amount: BigNumber,
  ): Promise<BaseResult> => {
    const result: BaseResult = { success: false };

    const {
      estimateGas: { stake: estimateGas },
      stake,
    } = this.masa.contracts.instances.DataStaking;

    try {
      // estimate gas
      const gasLimit = await this.estimateGasWithSlippage(estimateGas, [
        tokenId,
        amount,
      ]);

      const { wait, hash } = await stake(tokenId, amount, { gasLimit });

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
        console.error(result.message);
      }
    }

    return result;
  };
}
