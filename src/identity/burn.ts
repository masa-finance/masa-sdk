import { BigNumber } from "ethers";
import Masa from "../masa";
import { Messages } from "../utils";

export const burnIdentityById = async (
  masa: Masa,
  identityId: BigNumber
): Promise<boolean> => {
  let success = false;

  console.log(`Burning Identity with ID '${identityId}'!`);
  try {
    const { wait, hash } =
      await masa.contracts.instances.SoulboundIdentityContract.connect(
        masa.config.wallet
      ).burn(identityId);

    console.log(Messages.WaitingToFinalize(hash));
    await wait();

    console.log(`Burned Identity with ID '${identityId}'!`);
    success = true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Burning Identity Failed! ${error.message}`);
    }
  }

  return success;
};

export const burnIdentity = async (masa: Masa): Promise<boolean> => {
  const { identityId, address } = await masa.identity.load();
  if (!identityId) {
    console.error(Messages.NoIdentity(address));
    return false;
  }

  return burnIdentityById(masa, identityId);
};
