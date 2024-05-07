import { BigNumber, utils } from "ethers";

import { BaseResult, MasaInterface } from "../../../interface";

const secondsInMonth = 2_592_000;
const mil = 1_000_000;

/**
 *
 * @param masa
 */
export const info = async (masa: MasaInterface): Promise<BaseResult> => {
  const result: BaseResult = {
    success: false,
  };

  if (!masa.contracts.instances.MasaStaking.hasAddress) {
    result.message = `Unable to get info on ${masa.config.networkName}!`;
    console.error(result.message);

    return result;
  }

  try {
    const {
      getPeriods,
      secondsForPeriod,
      interestRates,
      totalStakedForPeriod,
      totalStaked,
      rewardsReserved,
      rewardsNotReserved,
      address,
    } = masa.contracts.instances.MasaStaking;

    const { balanceOf } = masa.contracts.instances.MasaToken;

    const [balance] = await Promise.all([balanceOf(address)]);

    const [periods, periodSize, allStakes, reserved, notReserved] =
      await Promise.all([
        getPeriods(),
        secondsForPeriod(),
        totalStaked(),
        rewardsReserved(),
        rewardsNotReserved(),
      ]);

    let totalRewards = BigNumber.from(0);

    for (const period of periods) {
      console.log(
        `Period: ${period.mul(periodSize).toNumber() / secondsInMonth} months`,
      );

      const [interest, totalStaked] = await Promise.all([
        interestRates(period),
        totalStakedForPeriod(period),
      ]);

      console.log(`Interest rate: ${interest.toNumber() / mil}%`);
      console.log(`Period total Staked: ${utils.formatEther(totalStaked)}`);

      const periodRewards = totalStaked.mul(interest.div(mil));

      console.log(`Period total Rewards: ${utils.formatEther(periodRewards)}`);

      totalRewards = totalRewards.add(periodRewards);

      console.log("\n");
    }

    const claimable = totalRewards.add(allStakes);

    console.log(`Total Staked: ${utils.formatEther(allStakes)}`);
    console.log(`Total Rewards: ${utils.formatEther(totalRewards)}`);
    console.log(`Total Claimable: ${utils.formatEther(claimable)}`);

    const balanceClaimableRatio = claimable.eq(0)
      ? 0
      : BigNumber.from(mil).mul(balance).div(claimable).toNumber() / mil;

    console.log(
      `Current Balance: ${utils.formatEther(balance)}, Balance / Claimable ratio: ${balanceClaimableRatio}`,
    );

    const reserveRatio = reserved.eq(0)
      ? 0
      : BigNumber.from(mil).mul(reserved).div(notReserved).toNumber() / mil;

    console.log(`Reserve ratio: ${reserveRatio}`);

    result.success = true;
  } catch (error: unknown) {
    result.message = "Info failed!";

    if (error instanceof Error) {
      result.message = `${result.message}: ${error.message}`;
    }

    console.error(result.message);
  }

  return result;
};
