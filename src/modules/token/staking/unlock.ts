import { Messages } from "../../../collections";
import { BaseResult, MasaInterface } from "../../../interface";

/**
 *
 * @param masa
 * @param position
 */
export const unlock = async (
  masa: MasaInterface,
  position: number,
): Promise<BaseResult> => {
  const result: BaseResult = {
    success: false,
  };

  console.log(`Unlocking position ${position}!`);

  if (!masa.contracts.instances.MasaStaking.hasAddress) {
    result.message = `Unable to unlock on ${masa.config.networkName}!`;
    console.error(result.message);

    return result;
  }

  try {
    const { unlock, canUnlockStake } = masa.contracts.instances.MasaStaking;

    if (
      !(await canUnlockStake(await masa.config.signer.getAddress(), position))
    ) {
      result.message = `Cannot unlock position ${position}`;
      console.error(result.message);

      return result;
    }

    console.log("Unlocking ...");

    const { wait, hash } = await unlock(position);

    console.log(
      Messages.WaitingToFinalize(
        hash,
        masa.config.network?.blockExplorerUrls?.[0],
      ),
    );

    await wait();

    console.log("Unlocking done!");

    result.success = true;
  } catch (error: unknown) {
    result.message = "Unlocking failed!";

    if (error instanceof Error) {
      result.message = `${result.message}: ${error.message}`;
    }

    console.error(result.message);
  }

  return result;
};
