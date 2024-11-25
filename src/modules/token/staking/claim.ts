import { utils } from "ethers";

import { Messages } from "../../../collections";
import { BaseResult, MasaInterface } from "../../../interface";
import { isSigner } from "../../../utils";

/**
 *
 * @param masa
 * @param position
 */
export const claim = async (
  masa: MasaInterface,
  position: number,
): Promise<BaseResult> => {
  const result: BaseResult = {
    success: false,
  };

  console.log(`Claiming position ${position}!`);

  if (
    !masa.contracts.instances.MasaStaking.hasAddress ||
    !isSigner(masa.config.signer)
  ) {
    result.message = `Unable to claim on ${masa.config.networkName}!`;
    console.error(result.message);

    return result;
  }

  try {
    const address = await masa.config.signer.getAddress();
    const { claim, canClaimStake, INTEREST_PRECISSION, getUserStake } =
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
      !(await canClaimStake(await masa.config.signer.getAddress(), position))
    ) {
      result.message = `Cannot claim position ${position}`;
      console.error(result.message);

      return result;
    }

    console.log("Claiming ...");

    const { wait, hash } = await claim(position);

    console.log(
      Messages.WaitingToFinalize(
        hash,
        masa.config.network?.blockExplorerUrls?.[0],
      ),
    );

    await wait();

    console.log("Claiming done!");

    result.success = true;
  } catch (error: unknown) {
    result.message = "Claiming failed!";

    if (error instanceof Error) {
      result.message = `${result.message}: ${error.message}`;
    }

    console.error(result.message);
  }

  return result;
};
