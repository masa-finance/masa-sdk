import { utils } from "ethers";

import { Messages } from "../../../collections";
import { BaseResult, MasaInterface } from "../../../interface";
import { isSigner } from "../../../utils";

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

  if (
    !masa.contracts.instances.MasaStaking.hasAddress ||
    !isSigner(masa.config.signer)
  ) {
    result.message = `Unable to unlock on ${masa.config.networkName}!`;
    console.error(result.message);

    return result;
  }

  console.log(`Unlocking position ${position}!`);

  try {
    const address = await masa.config.signer.getAddress();
    const { unlock, canUnlockStake, getUserStake, INTEREST_PRECISSION } =
      masa.contracts.instances.MasaStaking;

    if (masa.config.verbose) {
      const [{ stake }, precision] = await Promise.all([
        getUserStake(address, position),
        INTEREST_PRECISSION(),
      ]);

      console.log(`Amount ${utils.formatEther(stake.amount)} MASA`);
      console.log(`Period ${stake.period}`);
      console.log(
        `Reward ${stake.interestRate.toNumber() / precision.toNumber()}%`,
      );
    }

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
