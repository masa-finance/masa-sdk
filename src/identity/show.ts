import { BigNumber } from "@ethersproject/bignumber";
import Masa from "../masa";

export const loadIdentityDetails = async (
  masa: Masa,
  identityId: BigNumber
) => {
  const identityContracts = await masa.contracts.loadIdentityContracts();

  const tokenUri = masa.metadata.patchMetadataUrl(
    await identityContracts.SoulboundIdentityContract["tokenURI(uint256)"](
      identityId
    )
  );

  const metadata = await masa.metadata.getMetadata(tokenUri);

  return {
    tokenId: identityId,
    tokenUri,
    metadata,
  };
};

export const showIdentity = async (masa: Masa, address?: string) => {
  if (await masa.session.checkLogin()) {
    address = address || (await masa.config.wallet.getAddress());

    const identityId = await masa.identity.load(address);
    if (!identityId) return;

    const identity = await loadIdentityDetails(masa, identityId);

    console.log(`Identity Metadata URL: ${identity.tokenUri}`);

    if (identity.metadata) {
      console.log(`Metadata: ${JSON.stringify(identity.metadata, null, 2)}`);
    }
  } else {
    console.log("Not logged in please login first");
  }
};
