import Masa from "../masa";
import { IdentityDetails } from "../interface";
import { loadIdentity } from "./";

export const showIdentity = async (
  masa: Masa,
  address?: string
): Promise<IdentityDetails | undefined> => {
  const identity = await loadIdentity(masa, address);

  if (identity?.metadata) {
    console.log(`Metadata: ${JSON.stringify(identity.metadata, null, 2)}`);
  }

  return identity;
};
