import { BigNumber } from "ethers";
import Masa from "../masa";
import { Messages } from "../utils";

export const burnGreen = async (
  masa: Masa,
  greenId: BigNumber
): Promise<boolean> => {
  try {
    console.log(`Burning Green with ID '${greenId}'!`);
    const { hash, wait } =
      await masa.contracts.instances.SoulboundGreenContract.connect(
        masa.config.wallet
      ).burn(greenId);

    console.log(Messages.WaitingToFinalize(hash));
    await wait();

    console.log(`Burned Green with ID '${greenId}'!`);
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Burning Green Failed! '${error.message}'`);
    }
  }

  return false;
};
