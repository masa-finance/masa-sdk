import { utils } from "ethers";

import { BaseResult, MasaInterface } from "../../../interface";

export interface Stake {
  amount: string;
  reward: string;
  claimable: string;
  startTime: number;
  endTime: number;
  unlockTime: number;
  period: number;
  interestRate: number;
  canUnlock: boolean;
  canClaim: boolean;
  position: number;
}

const secondsInMonth = 2_592_000;

/**
 *
 * @param masa
 * @param address
 */
export const list = async (
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
    const {
      getUserStake,
      getUserStakeCount,
      secondsForPeriod,
      cooldownPeriod,
      INTEREST_PRECISSION,
    } = masa.contracts.instances.MasaStaking;

    const { decimals: getDecimals, symbol: getSymbol } =
      masa.contracts.instances.MasaToken;

    const [stakeCount, periodSize, cooldownPeriodSize, precision] =
      await Promise.all([
        getUserStakeCount(address),
        secondsForPeriod(),
        cooldownPeriod(),
        INTEREST_PRECISSION(),
      ]);

    const [decimals, symbol] = await Promise.all([getDecimals(), getSymbol()]);

    result.stakes = [];

    for (let i = 0; i < stakeCount.toNumber(); i++) {
     const userStake = await getUserStake(address, i);
     console.log({userStake})
     const {
      stake: { amount, startTime, period, interestRate, unlockTime },
      canClaim,
      canUnlock,
    }  = userStake
      const duration = period.mul(periodSize);
      const rewards = amount.mul(interestRate).div(100 * precision.toNumber());

      const stake: Stake = {
        amount: utils.formatUnits(amount, decimals),
        reward: utils.formatUnits(rewards, 18),
        claimable: utils.formatUnits(rewards.add(amount)),
        startTime: startTime.toNumber(),
        endTime: startTime.add(duration).toNumber(),
        unlockTime: unlockTime.gt(0)
          ? unlockTime.add(cooldownPeriodSize).toNumber()
          : 0,
        period: period.toNumber(),
        interestRate: interestRate.toNumber() / precision.toNumber(),
        canClaim,
        canUnlock,
        position: i,
      };

      console.log("\n");
      console.log(`Position: ${stake.position}`);
      console.log(`Amount: ${stake.amount} ${symbol}`);
      console.log(`Interest rate: ${stake.interestRate}%`);
      console.log(`Period: ${duration.toNumber() / secondsInMonth} months`);
      console.log(`Reward: ${stake.reward} ${symbol}`);
      console.log(
        `Total Claimable (after period): ${stake.claimable} ${symbol}`,
      );

      console.log(
        `Stake Date: ${new Date(stake.startTime * 1000).toLocaleString()}`,
      );
      console.log(
        `Unlock Date: ${new Date(stake.endTime * 1000).toLocaleString()}`,
      );

      if (unlockTime.gt(0)) {
        console.log(
          `Claim Date: ${new Date(stake.unlockTime * 1000).toLocaleString()}`,
        );
      } else {
        console.log(`Can unlock: ${stake.canUnlock}`);
      }

      console.log(`Can claim: ${stake.canClaim}`);

      result.stakes.push(stake);
    }

    result.success = true;
  } catch (error: unknown) {
    result.message = "List failed!";

    if (error instanceof Error) {
      result.message = `${result.message}: ${error.message}`;
    }

    console.error(result.message);
  }

  return result;
};
