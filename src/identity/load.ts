import { BigNumber } from "ethers";
import Masa from "../masa";
import { Messages } from "../utils";
import { patchMetadataUrl } from "../helpers";
import { IdentityDetails, IIdentity } from "../interface";

export const loadIdentityByAddress = async (
  masa: Masa,
  address?: string
): Promise<{ identityId?: BigNumber; address?: string }> => {
  let identityId;

  try {
    address = address || (await masa.config.wallet.getAddress());

    const balance =
      await masa.contracts.instances.SoulboundIdentityContract.balanceOf(
        address
      );

    if (balance.toNumber() > 0) {
      identityId =
        await masa.contracts.instances.SoulboundIdentityContract.tokenOfOwner(
          address
        );
    }

    if (!identityId && masa.config.verbose) {
      console.error(Messages.NoIdentity(address));
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
    address = await masa.contracts.instances.SoulboundIdentityContract[
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

export const loadIdentityDetails = async (
  masa: Masa,
  identityId: BigNumber
): Promise<IdentityDetails> => {
  const tokenUri = patchMetadataUrl(
    masa,
    await masa.contracts.instances.SoulboundIdentityContract[
      "tokenURI(uint256)"
    ](identityId)
  );

  if (masa.config.verbose) {
    console.info(`Identity Metadata URL: '${tokenUri}'`);
  }

  const metadata: IIdentity | undefined = <IIdentity | undefined>(
    await masa.client.metadata.get(tokenUri)
  );

  return {
    tokenId: identityId,
    tokenUri,
    metadata,
  };
};

export const loadIdentity = async (
  masa: Masa,
  address?: string
): Promise<IdentityDetails | undefined> => {
  address = address || (await masa.config.wallet.getAddress());

  const { identityId } = await masa.identity.load(address);
  if (!identityId) {
    console.error(Messages.NoIdentity(address));
    return;
  }

  return loadIdentityDetails(masa, identityId);
};
