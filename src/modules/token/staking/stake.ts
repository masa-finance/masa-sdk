import { BigNumber, utils } from "ethers";

import { Messages } from "../../../collections";
import { BaseResult, MasaInterface } from "../../../interface";
import { isSigner } from "../../../utils/is-signer";

const secondsInMonth = 2_592_000;

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

  if (
    !masa.contracts.instances.MasaStaking.hasAddress ||
    !isSigner(masa.config.signer)
  ) {
    result.message = `Unable to stake on ${masa.config.networkName}!`;
    console.error(result.message);

    return result;
  }

  const tokenAmount = BigNumber.from(utils.parseEther(amount));

  try {
    const address = await masa.config.signer.getAddress();

    const { symbol, approve, allowance } = masa.contracts.instances.MasaToken;

    const {
      stake,
      getPeriods,
      secondsForPeriod,
      address: masaStakingAddress,
    } = masa.contracts.instances.MasaStaking;

    const periodSize = (await secondsForPeriod()).toNumber();

    console.log(
      `Staking ${parseFloat(amount).toLocaleString()} ${await symbol()} for ${(duration * periodSize) / secondsInMonth} months!`,
    );

    const currentAllowance = await allowance(address, masaStakingAddress);

    if (currentAllowance.lt(tokenAmount)) {
      console.log("Approving ...");

      const { wait, hash } = await approve(masaStakingAddress, tokenAmount);

      console.log(
        Messages.WaitingToFinalize(
          hash,
          masa.config.network?.blockExplorerUrls?.[0],
        ),
      );

      await wait();
    }

    const periods = await getPeriods();

    if (!periods.find((period: BigNumber) => period.toNumber() === duration)) {
      result.message = `Duration ${duration} not configured on contract!`;
      console.error(result.message);
      return result;
    }

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
