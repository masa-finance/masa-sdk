import { loadIdentityContracts } from "../contracts";
import Masa from "../masa"

export const loadIdentity = async (masa: Masa, address: string) => {
  const identityContracts = await loadIdentityContracts({
    provider: masa.config.provider,
    network: masa.config.network,
  });

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
