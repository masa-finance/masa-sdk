import Masa from "../masa";
import { Messages } from "../utils";

export const burnGreenById = async (
  masa: Masa,
  greenId: number
): Promise<boolean> => {
  try {
    const tx = await masa.contracts.instances.SoulboundGreenContract.connect(
      masa.config.wallet
    ).burn(greenId);

    console.log(Messages.WaitingToFinalize(tx.hash));
    await tx.wait();

    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Burning Green Failed! '${error.message}'`);
    }
  }

  return false;
};

export const burnGreen = async (
  masa: Masa,
  greenId: number
): Promise<boolean> => {
  let success = false;

  if (await masa.session.checkLogin()) {
    console.log(`Burning Green with ID '${greenId}'!`);
    success = await burnGreenById(masa, greenId);

    if (success) {
      console.log(`Burned Green with ID '${greenId}'!`);
    }
  } else {
    console.error(Messages.NotLoggedIn());
  }

  return success;
};
