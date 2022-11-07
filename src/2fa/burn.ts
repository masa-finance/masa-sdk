import Masa from "../masa";

export const burn2faById = async (
  masa: Masa,
  twofaId: number
): Promise<boolean> => {
  const identityContracts = await masa.contracts.loadIdentityContracts();

  try {
    const tx = await identityContracts.Soulbound2FA.connect(
      masa.config.wallet
    ).burn(twofaId);

    console.log("Waiting for the burn tx to finalize");
    await tx.wait();

    return true;
  } catch (err: any) {
    console.error(`Burning of 2fa Failed! '${err.message}'`);
  }

  return false;
};

export const burn2fa = async (
  masa: Masa,
  twofaId: number
): Promise<boolean> => {
  let success = false;

  if (await masa.session.checkLogin()) {
    const identityId = await masa.identity.load();
    if (!identityId) return success;
    console.log(`Burning 2fa with id '${twofaId}'!`);

    success = await burn2faById(masa, twofaId);

    if (success) {
      console.log(`Burned 2fa with id '${twofaId}'!`);
    }
  } else {
    console.log("Not logged in please login first");
  }

  return success;
};
