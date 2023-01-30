import { BigNumber } from "@ethersproject/bignumber";
import Masa from "../masa";
import { IIdentity } from "../interface";
import { patchMetadataUrl } from "../helpers";

export const loadIdentityDetails = async (
  masa: Masa,
  identityId: BigNumber
): Promise<{
  tokenId: BigNumber;
  tokenUri: string;
  metadata?: IIdentity;
}> => {
  const tokenUri = patchMetadataUrl(
    masa,
    await masa.contracts.instances.SoulboundIdentityContract[
      "tokenURI(uint256)"
    ](identityId)
  );

  const metadata: IIdentity | undefined = <IIdentity | undefined>(
    await masa.metadata.retrieve(tokenUri)
  );

  return {
    tokenId: identityId,
    tokenUri,
    metadata,
  };
};

export const showIdentity = async (
  masa: Masa,
  address?: string
): Promise<
  | {
      tokenId: BigNumber;
      tokenUri: string;
      metadata?: IIdentity;
    }
  | undefined
> => {
  if (await masa.session.checkLogin()) {
    address = address || (await masa.config.wallet.getAddress());

    const { identityId } = await masa.identity.load(address);
    if (!identityId) return;

    const identity = await loadIdentityDetails(masa, identityId);

    console.log(`Identity Metadata URL: '${identity.tokenUri}'`);

    if (identity.metadata) {
      console.log(`Metadata: ${JSON.stringify(identity.metadata, null, 2)}`);
    }

    return identity;
  } else {
    console.log("Not logged in please login first");
  }
};
