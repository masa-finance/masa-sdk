import { BigNumber } from "ethers";
import Masa from "../masa";
import { isBigNumber, Messages } from "../utils";
import { patchMetadataUrl } from "../helpers";
import { IdentityDetails, IIdentity } from "../interface";
import { resolveReverseIdentity } from "./resolve";

export const loadIdentityByAddress = async (
  masa: Masa,
  address?: string
): Promise<{ identityId?: BigNumber; address: string }> => {
  address = address || (await masa.config.wallet.getAddress());
  let identityId;

  try {
    const balance =
      await masa.contracts.instances.SoulboundIdentityContract.balanceOf(
        address
      );

    if (balance.toNumber() > 0) {
      identityId = await resolveReverseIdentity(masa, address);
    }

    if (!identityId && masa.config.verbose) {
      console.error(Messages.NoIdentity(address));
    }
  } catch {
    // ignore
  }

  return { identityId, address };
};

export const loadIdentityDetails = async (
  masa: Masa,
  identityIdOrAddress: BigNumber | string
): Promise<IdentityDetails> => {
  const {
    "tokenURI(address)": tokenURIByAddress,
    "tokenURI(uint256)": tokenURIByIdentity,
  } = masa.contracts.instances.SoulboundIdentityContract;

  const identityId = !isBigNumber(identityIdOrAddress)
    ? await masa.contracts.instances.SoulboundIdentityContract.tokenOfOwner(
        identityIdOrAddress
      )
    : identityIdOrAddress;

  const tokenUri = patchMetadataUrl(
    masa,
    await (isBigNumber(identityIdOrAddress)
      ? tokenURIByIdentity(identityIdOrAddress)
      : tokenURIByAddress(identityIdOrAddress))
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
