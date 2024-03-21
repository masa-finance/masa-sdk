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
export const deposit = async (
  masa: MasaInterface,
  amount: string,
): Promise<void> => {
  const tokenAmount = BigNumber.from(utils.parseEther(amount));

  console.log(`Depositing ${parseFloat(amount).toLocaleString()} MASA!`);

  if (
    !masa.config.network?.addresses.tokens?.MASA ||
    (masa.config.networkName !== "masa" &&
      masa.config.networkName !== "masatest")
  ) {
    console.log(`Unable to deposit on ${masa.config.networkName}!`);
    return;
  }

  // origin
  const oft: MasaTokenNativeOFT = MasaTokenNativeOFT__factory.connect(
    masa.config.network.addresses.tokens.MASA,
    masa.config.signer,
  );

  try {
    const { deposit } = oft;

    console.log("Depositting ...");

    const { wait, hash } = await deposit({
      value: tokenAmount,
    });

    console.log(
      Messages.WaitingToFinalize(
        hash,
        masa.config.network.blockExplorerUrls?.[0],
      ),
    );

    await wait();

    console.log("Deposit done!");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};
