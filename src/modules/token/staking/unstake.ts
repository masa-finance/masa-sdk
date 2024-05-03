import { Messages } from "../../../collections";
import { BaseResult, MasaInterface } from "../../../interface";

/**
 *
 * @param masa
 * @param position
 */
export const unstake = async (
  masa: MasaInterface,
  position: number,
): Promise<BaseResult> => {
  const result: BaseResult = {
    success: false,
  };

  console.log(`Unstaking position ${position}!`);

  if (!masa.contracts.instances.MasaStaking.hasAddress) {
    result.message = `Unable to unstake on ${masa.config.networkName}!`;
    console.error(result.message);

    return result;
  }

  try {
    const { unstake, canWithdrawStake } = masa.contracts.instances.MasaStaking;

    if (
      !(await canWithdrawStake(await masa.config.signer.getAddress(), position))
    ) {
      result.message = `Cannot unstake position ${position}`;
      console.error(result.message);

      return result;
    }

    console.log("Unstaking ...");

    const { wait, hash } = await unstake(position);

    console.log(
      Messages.WaitingToFinalize(
        hash,
        masa.config.network?.blockExplorerUrls?.[0],
      ),
    );

    await wait();

    console.log("Unstaking done!");

    result.success = true;
  } catch (error: unknown) {
    result.message = "Unstaking failed!";

    if (error instanceof Error) {
      result.message = `${result.message}: ${error.message}`;
    }

    console.error(result.message);
  }

  return result;
};
