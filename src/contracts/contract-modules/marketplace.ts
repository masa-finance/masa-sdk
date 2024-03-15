import { BigNumber } from "ethers";

import { Messages } from "../../collections";
import type { BaseResult } from "../../interface";
import { MasaModuleBase } from "./masa-module-base";

export class Marketplace extends MasaModuleBase {
  public stakeAll = async (): Promise<BaseResult> => {
    const result: BaseResult = { success: false };

    const {
      estimateGas: { stakeAll: estimateGas },
      stakeAll,
    } = this.masa.contracts.instances.DataStakingDynamic;

    try {
      // estimate gas
      const gasLimit = await this.estimateGasWithSlippage(estimateGas, []);

      const { wait, hash } = await stakeAll({ gasLimit });

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

  public claimAllRewards = async (): Promise<BaseResult> => {
    const result: BaseResult = { success: false };

    const {
      estimateGas: { claimAllRewards: estimateGas },
      claimAllRewards,
    } = this.masa.contracts.instances.DataStakingDynamic;

    try {
      // estimate gas
      const gasLimit = await this.estimateGasWithSlippage(estimateGas, []);

      const { wait, hash } = await claimAllRewards({ gasLimit });

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

  public getRemainingRewards = async (): Promise<BaseResult> => {
    const result: BaseResult = { success: false, message: "" };

    const { getRemainingRewards } =
      this.masa.contracts.instances.DataStakingDynamic;

    try {
      const remainingRewards = await getRemainingRewards();

      result.success = true;
      result.message = `Remaining rewards: ${remainingRewards.toString()}`;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        result.message = error.message;
      }
    }

    return result;
  };

  public dataPointsMulti = async (): Promise<BaseResult> => {
    const result: BaseResult = { success: false, message: "" };

    try {
      const dataPointsMulti =
        await this.masa.contracts.instances.DataStakingDynamic.dataPointsMulti();

      result.success = true;
      result.message = `DataPointsMulti address: ${dataPointsMulti}`;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        result.message = error.message;
      }
    }

    return result;
  };

  public name = async (): Promise<BaseResult> => {
    const result: BaseResult = { success: false, message: "" };

    try {
      const name =
        await this.masa.contracts.instances.DataStakingDynamic.name();

      result.success = true;
      result.message = `Staking pool name: ${name}`;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        result.message = error.message;
      }
    }

    return result;
  };

  public owner = async (): Promise<BaseResult> => {
    const result: BaseResult = { success: false, message: "" };

    try {
      const owner =
        await this.masa.contracts.instances.DataStakingDynamic.owner();

      result.success = true;
      result.message = `Owner address: ${owner}`;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        result.message = error.message;
      }
    }

    return result;
  };

  public stakeInfos = async (tokenId: BigNumber): Promise<BaseResult> => {
    const result: BaseResult = { success: false, message: "" };

    try {
      const stakeInfo =
        await this.masa.contracts.instances.DataStakingDynamic.stakeInfos(
          tokenId,
        );

      result.success = true;
      result.message = `Stake info: ${JSON.stringify(stakeInfo)}`;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        result.message = error.message;
      }
    }

    return result;
  };

  public totalRewardsPool = async (): Promise<BaseResult> => {
    const result: BaseResult = { success: false, message: "" };

    try {
      const totalRewardsPool =
        await this.masa.contracts.instances.DataStakingDynamic.totalRewardsPool();

      result.success = true;
      result.message = `Total rewards pool: ${totalRewardsPool.toString()}`;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        result.message = error.message;
      }
    }

    return result;
  };

  public userStakes = async (
    userAddress: string,
    tokenId: BigNumber,
  ): Promise<BaseResult> => {
    const result: BaseResult = { success: false, message: "" };

    try {
      const userStake =
        await this.masa.contracts.instances.DataStakingDynamic.userStakes(
          userAddress,
          tokenId,
        );

      result.success = true;
      result.message = `User stake: ${userStake.toString()}`;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        result.message = error.message;
      }
    }

    return result;
  };
}
