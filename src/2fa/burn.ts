import Masa from "../masa";

export const burn2FAById = async (
  masa: Masa,
  twoFAId: number
): Promise<boolean> => {
  try {
    const tx = await masa.contracts.identity.Soulbound2FAContract.connect(
      masa.config.wallet
    ).burn(twoFAId);

    console.log("Waiting for the burn tx to finalize");
    await tx.wait();

    return true;
  } catch (err: any) {
    console.error(`Burning of 2FA Failed! '${err.message}'`);
  }

  return false;
};

export const burn2FA = async (
  masa: Masa,
  twoFAId: number
): Promise<boolean> => {
  let success = false;

  if (await masa.session.checkLogin()) {
    const { identityId } = await masa.identity.load();
    if (!identityId) return success;
    console.log(`Burning 2FA with id '${twoFAId}'!`);

    success = await burn2FAById(masa, twoFAId);
    if (success) {
      console.log(`Burned 2FA with id '${twoFAId}'!`);
    }
  } else {
    console.log("Not logged in please login first");
  }

  return success;
};
