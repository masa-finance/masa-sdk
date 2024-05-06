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
    } = masa.contracts.instances.MasaStaking;

    let totalRewards = BigNumber.from(0);

    const [periods, periodSize, allStakes, balance] = await Promise.all([
      getPeriods(),
      secondsForPeriod(),
      totalStaked(),
      masa.contracts.instances.MasaToken.balanceOf(
        masa.contracts.instances.MasaStaking.address,
      ),
    ]);

    for (const period of periods) {
      console.log(
        `Period: ${period.mul(periodSize).toNumber() / secondsInMonth} months`,
      );

      const [interest, totalStaked] = await Promise.all([
        interestRates(period),
        totalStakedForPeriod(period),
      ]);

      console.log(`Interest rate: ${interest}%`);
      console.log(`Period total Staked: ${utils.formatEther(totalStaked)}`);

      const periodRewards = totalStaked.mul(interest).div(100);

      console.log(`Period total Rewards: ${utils.formatEther(periodRewards)}`);

      totalRewards = totalRewards.add(periodRewards);

      console.log("\n");
    }

    const claimable = totalRewards.add(allStakes);

    console.log(`Total Staked: ${utils.formatEther(allStakes)}`);
    console.log(`Total Rewards: ${utils.formatEther(totalRewards)}`);
    console.log(`Total Claimable: ${utils.formatEther(claimable)}`);

    const ratio =
      BigNumber.from(mil).mul(balance).div(claimable).toNumber() / mil;

    console.log(
      `Current Balance: ${utils.formatEther(balance)}, Balance / Claimable ratio: ${ratio}`,
    );

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
