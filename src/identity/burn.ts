import { BigNumber } from "ethers";
import Masa from "../masa";
import { Messages } from "../utils";

export const burnIdentityById = async (
  masa: Masa,
  identityId: BigNumber
): Promise<boolean> => {
  let success = false;

  console.log("Burning Identity");
  try {
    const tx = await masa.contracts.instances.SoulboundIdentityContract.connect(
      masa.config.wallet
    ).burn(identityId);

    console.log(Messages.WaitingToFinalize(tx.hash));
    await tx.wait();

    console.log(`Identity with token ID '${identityId}' burned!`);
    success = true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Burning of Identity Failed! ${error.message}`);
    }
  }

  return success;
};

export const burnIdentity = async (masa: Masa): Promise<boolean> => {
  let success = false;

  if (await masa.session.checkLogin()) {
    const { identityId } = await masa.identity.load();
    if (!identityId) return success;

    success = await burnIdentityById(masa, identityId);
  } else {
    console.error(Messages.NotLoggedIn());
  }

  return success;
};
