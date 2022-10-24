import Masa from "../masa";

export const loadIdentity = async (masa: Masa, address: string) => {
  const identityContracts = await masa.contracts.loadIdentityContracts();

  let identityId;

  try {
    identityId = await identityContracts.SoulboundIdentityContract.tokenOfOwner(
      address
    );
  } catch {
    // ignore
  }

  if (!identityId) {
    console.error(`No identity for '${address}'!`);
  }

  return identityId;
};
