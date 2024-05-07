import { Messages } from "../../../collections";
import { BaseResult, MasaInterface } from "../../../interface";

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

  if (!masa.contracts.instances.MasaStaking.hasAddress) {
    result.message = `Unable to claim on ${masa.config.networkName}!`;
    console.error(result.message);

    return result;
  }

  try {
    const { claim, canClaimStake } = masa.contracts.instances.MasaStaking;

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
