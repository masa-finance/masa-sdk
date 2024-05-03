import { utils } from "ethers";

import { BaseResult, MasaInterface } from "../../../interface";

export interface Stake {
  amount: string;
  startTime: number;
  endTime: number;
  period: number;
  interestRate: number;
  canWithdraw: boolean;
  position: number;
}

const secondsInMonth = 2_592_000;

/**
 *
 * @param masa
 * @param address
 */
export const show = async (
  masa: MasaInterface,
  address?: string,
): Promise<BaseResult & { stakes?: Stake[] }> => {
  const result: BaseResult & { stakes?: Stake[] } = {
    success: false,
  };

  address = address || (await masa.config.signer.getAddress());

  console.log(address);

  if (!masa.contracts.instances.MasaStaking.hasAddress) {
    result.message = `Unable to show on ${masa.config.networkName}!`;
    console.error(result.message);

    return result;
  }

  try {
    const { getUserStake, getUserStakeCount, secondsForPeriod } =
      masa.contracts.instances.MasaStaking;

    const stakeCount = (await getUserStakeCount(address)).toNumber();
    const periodSize = await secondsForPeriod();
    const decimals = await masa.contracts.instances.MasaToken.decimals();

    result.stakes = [];

    for (let i = 0; i < stakeCount; i++) {
      const { amount, startTime, period, interestRate, canWithdraw } =
        await getUserStake(address, i);

      const duration = period.mul(periodSize);

      const stake: Stake = {
        amount: utils.formatUnits(amount, decimals).toString(),
        startTime: startTime.toNumber(),
        endTime: startTime.add(duration).toNumber(),
        period: period.toNumber(),
        interestRate: interestRate.toNumber(),
        canWithdraw,
        position: i,
      };

      console.log("Position:", stake.position);
      console.log("Amount:", stake.amount);
      console.log(
        "Start Date:",
        new Date(stake.startTime * 1000).toLocaleString(),
      );
      console.log("End Date:", new Date(stake.endTime * 1000).toLocaleString());
      console.log("Can withdraw:", stake.canWithdraw);
      console.log("period:", duration.toNumber() / secondsInMonth, "months");
      console.log("interest rate:", stake.interestRate, "%");

      result.stakes.push(stake);
    }

    result.success = true;
  } catch (error: unknown) {
    result.message = "Show failed!";

    if (error instanceof Error) {
      result.message = `${result.message}: ${error.message}`;
    }

    console.error(result.message);
  }

  return result;
};
