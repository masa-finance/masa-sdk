import Masa from "../masa";
import { Messages } from "../utils/messages";

export const burnGreenById = async (
  masa: Masa,
  greenId: number
): Promise<boolean> => {
  try {
    const tx = await masa.contracts.instances.Soulbound2FAContract.connect(
      masa.config.wallet
    ).burn(greenId);

    console.log(Messages.WaitingToFinalize(tx.hash));
    await tx.wait();

    return true;
  } catch (err: any) {
    console.error(`Burning Green Failed! '${err.message}'`);
  }

  return false;
};

export const burnGreen = async (
  masa: Masa,
  greenId: number
): Promise<boolean> => {
  let success = false;

  if (await masa.session.checkLogin()) {
    const { identityId } = await masa.identity.load();
    if (!identityId) return success;
    console.log(`Burning Green with id '${greenId}'!`);

    success = await burnGreenById(masa, greenId);
    if (success) {
      console.log(`Burned Green with id '${greenId}'!`);
    }
  } else {
    console.log("Not logged in please login first");
  }

  return success;
};
