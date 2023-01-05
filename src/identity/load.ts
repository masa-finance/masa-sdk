import Masa from "../masa";
import { BigNumber } from "ethers";
import { ErrorMessage } from "../utils";

export const loadIdentityByAddress = async (
  masa: Masa,
  address?: string
): Promise<{ identityId?: BigNumber; address?: string }> => {
  let identityId;

  try {
    address = address || (await masa.config.wallet.getAddress());

    const balance =
      await masa.contracts.identity.SoulboundIdentityContract.balanceOf(
        address
      );

    if (balance.toNumber() > 0) {
      identityId =
        await masa.contracts.identity.SoulboundIdentityContract.tokenOfOwner(
          address
        );
    }

    if (!identityId) {
      console.error(ErrorMessage.NoIdentity(address));
    }
  } catch {
    // ignore
  }

  return { identityId, address };
};

export const loadAddressFromIdentityId = async (
  masa: Masa,
  identityId: BigNumber
): Promise<string | undefined> => {
  let address;

  try {
    address = await masa.contracts.identity.SoulboundIdentityContract[
      "ownerOf(uint256)"
    ](identityId);
  } catch {
    // ignore
  }

  if (!address) {
    console.error(`Identity '${identityId}' does not exist`);
  }

  return address;
};
