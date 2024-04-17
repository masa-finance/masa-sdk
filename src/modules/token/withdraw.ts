import {
  MasaTokenNativeOFT,
  MasaTokenNativeOFT__factory,
} from "@masa-finance/masa-token/dist/typechain";
import { BigNumber, utils } from "ethers";

import { Messages } from "../../collections";
import { BaseResult, MasaInterface } from "../../interface";

/**
 *
 * @param masa
 * @param amount
 */
export const withdraw = async (
  masa: MasaInterface,
  amount: string,
): Promise<BaseResult> => {
  const result: BaseResult = {
    success: false,
  };

  const tokenAmount = BigNumber.from(utils.parseEther(amount));

  console.log(`Withdrawing ${parseFloat(amount).toLocaleString()} MASA!`);

  if (
    !masa.config.network?.addresses.tokens?.MASA ||
    (masa.config.networkName !== "masa" &&
      masa.config.networkName !== "masatest")
  ) {
    result.message = `Unable to withdraw on ${masa.config.networkName}!`;
    console.log(result.message);
    return result;
  }

  // origin
  const oft: MasaTokenNativeOFT = MasaTokenNativeOFT__factory.connect(
    masa.config.network.addresses.tokens.MASA,
    masa.config.signer,
  );

  try {
    const { withdraw } = oft;

    console.log("Withdrawing ...");

    const { wait, hash } = await withdraw(tokenAmount);

    console.log(
      Messages.WaitingToFinalize(
        hash,
        masa.config.network.blockExplorerUrls?.[0],
      ),
    );

    await wait();

    console.log("Withdraw done!");
    result.success = true;
  } catch (error: unknown) {
    result.message = "Withdraw failed!";

    if (error instanceof Error) {
      result.message = `${result.message}: ${error.message}`;
    }

    console.error(result.message);
  }

  return result;
};
