import type { BigNumber } from "ethers";

import type { MasaInterface } from "../../interface";

/**
 * Resolves identity id into address
 * @param masa
 * @param identityId
 */
export const resolveIdentity = async (
  masa: MasaInterface,
  identityId: BigNumber,
): Promise<string | undefined> => {
  let address;

  try {
    const { "ownerOf(uint256)": ownerOf } =
      masa.contracts.instances.SoulboundIdentityContract;
    address = await ownerOf(identityId);
  } catch {
    // ignore
  }

  if (!address) {
    console.error(`Identity '${identityId}' does not exist!`);
  }

  return address;
};

export const resolveReverseIdentity = async (
  masa: MasaInterface,
  address: string,
): Promise<BigNumber | undefined> => {
  let identityId;

  try {
    identityId =
      await masa.contracts.instances.SoulboundIdentityContract.tokenOfOwner(
        address,
      );
  } catch {
    // ignore
  }

  if (!identityId) {
    console.error(`Address '${address}' does not have an identity!`);
  }

  return identityId;
};
