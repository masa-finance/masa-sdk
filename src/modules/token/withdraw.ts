import {
  MasaTokenNativeOFT,
  MasaTokenNativeOFT__factory,
} from "@masa-finance/masa-token/dist/typechain";
import { BigNumber, utils } from "ethers";

import { Messages } from "../../collections";
import { MasaInterface } from "../../interface";

/**
 *
 * @param masa
 * @param amount
 */
export const withdraw = async (
  masa: MasaInterface,
  amount: string,
): Promise<void> => {
  const tokenAmount = BigNumber.from(utils.parseEther(amount));

  console.log(`Withdrawing ${parseFloat(amount).toLocaleString()} MASA!`);

  if (
    !masa.config.network?.addresses.tokens?.MASA ||
    (masa.config.networkName !== "masa" &&
      masa.config.networkName !== "masatest")
  ) {
    console.log(`Unable to withdraw on ${masa.config.networkName}!`);
    return;
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};
