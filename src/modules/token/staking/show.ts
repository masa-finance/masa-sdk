import { BaseResult, MasaInterface } from "../../../interface";

export interface Stake {
  amount: string;
  startTime: number;
  period: number;
  interestRate: number;
  canWithdraw: boolean;
  index: number;
}

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
    const { getUserStake, getUserStakeCount } =
      masa.contracts.instances.MasaStaking;

    const stakeCount = (await getUserStakeCount(address)).toNumber();

    result.stakes = [];

    for (let i = 0; i < stakeCount; i++) {
      const { amount, startTime, period, interestRate, canWithdraw } =
        await getUserStake(address, i);

      const stake: Stake = {
        amount: amount.toString(),
        startTime: startTime.toNumber(),
        period: period.toNumber(),
        interestRate: interestRate.toNumber(),
        canWithdraw,
        index: i,
      };

      console.log({ stake });

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
