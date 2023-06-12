import type { BigNumber } from "@ethersproject/bignumber";

import { Messages } from "../../collections";
import type {
  IdentityDetails,
  IIdentity,
  MasaInterface,
} from "../../interface";
import { isBigNumber, patchMetadataUrl } from "../../utils";
import { resolveReverseIdentity } from "./resolve";

export const loadIdentityByAddress = async (
  masa: MasaInterface,
  address?: string
): Promise<{ identityId?: BigNumber; address: string }> => {
  address = address || (await masa.config.signer.getAddress());
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
  masa: MasaInterface,
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
  masa: MasaInterface,
  address?: string
): Promise<IdentityDetails | undefined> => {
  let result;

  address = address || (await masa.config.signer.getAddress());

  const { identityId } = await masa.identity.load(address);
  if (identityId) {
    result = await loadIdentityDetails(masa, identityId);
  } else {
    console.error(Messages.NoIdentity(address));
  }

  return result;
};
