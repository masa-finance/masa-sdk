import type { IdentityDetails, MasaInterface } from "../../interface";
import { loadIdentity } from "./load";

export const showIdentity = async (
  masa: MasaInterface,
  address?: string
): Promise<IdentityDetails | undefined> => {
  const identity = await loadIdentity(masa, address);

  if (identity?.metadata) {
    console.log(`Metadata: ${JSON.stringify(identity.metadata, null, 2)}`);
  }

  return identity;
};
