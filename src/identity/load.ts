import Masa from "../masa";
import { BigNumber } from "ethers";

export const loadIdentityByAddress = async (
  masa: Masa,
  address?: string
): Promise<BigNumber | undefined> => {
  address = address || (await masa.config.wallet.getAddress());

  let identityId;

  try {
    identityId =
      await masa.contracts.identity.SoulboundIdentityContract.tokenOfOwner(
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

export const loadAddressByIdentity = async (
  masa: Masa,
  identityId: BigNumber | number
): Promise<string | undefined> => {
  let address;
  try {
    address = await masa.contracts.identity.SoulboundIdentityContract[
      "ownerOf(uint256)"
    ](identityId);
  } catch {
    // ignore
  }

  if (!identityId) {
    console.error(`Identity '${identityId}' does not exist`);
  }

  return address;
};
