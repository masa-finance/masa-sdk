import { BigNumber, utils } from "ethers";

import { Messages } from "../../../collections";
import { BaseResult, MasaInterface } from "../../../interface";

/**
 *
 * @param masa
 * @param amount
 * @param duration
 */
export const stake = async (
  masa: MasaInterface,
  amount: string,
  duration: number,
): Promise<BaseResult> => {
  const result: BaseResult = {
    success: false,
  };

  const tokenAmount = BigNumber.from(utils.parseEther(amount));

  console.log(
    `Staking ${parseFloat(amount).toLocaleString()} MASA for ${duration}!`,
  );

  if (!masa.contracts.instances.MasaStaking.hasAddress) {
    result.message = `Unable to stake on ${masa.config.networkName}!`;
    console.error(result.message);

    return result;
  }

  try {
    const { stake } = masa.contracts.instances.MasaStaking;

    console.log("Staking ...");

    const { wait, hash } = await stake(tokenAmount, duration);

    console.log(
      Messages.WaitingToFinalize(
        hash,
        masa.config.network?.blockExplorerUrls?.[0],
      ),
    );

    await wait();

    console.log("Staking done!");

    result.success = true;
  } catch (error: unknown) {
    result.message = "Staking failed!";

    if (error instanceof Error) {
      result.message = `${result.message}: ${error.message}`;
    }

    console.error(result.message);
  }

  return result;
};
