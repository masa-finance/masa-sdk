import { BigNumber } from "ethers";
import Masa from "../masa";
import { IGreen } from "../interface";
import { patchMetadataUrl } from "../helpers";

export const loadGreensByIdentityId = async (
  masa: Masa,
  identityId: BigNumber
): Promise<
  {
    tokenId: BigNumber;
    tokenUri: string;
    metadata?: IGreen;
  }[]
> => {
  const twoFSIds: BigNumber[] =
    await masa.contracts.instances.SoulLinkerContract[
      "getSBTConnections(uint256,address)"
    ](identityId, masa.contracts.instances.Soulbound2FAContract.address);

  return await Promise.all(
    twoFSIds.map(async (tokenId) => {
      const tokenUri = patchMetadataUrl(
        masa,
        await masa.contracts.instances.Soulbound2FAContract.tokenURI(tokenId)
      );

      const metadata = <IGreen | undefined>(
        await masa.metadata.retrieve(tokenUri)
      );

      return {
        tokenId,
        tokenUri,
        metadata,
      };
    })
  );
};

export const listGreens = async (
  masa: Masa,
  address?: string
): Promise<
  {
    tokenId: BigNumber;
    tokenUri: string;
    metadata?: IGreen;
  }[]
> => {
  address = address || (await masa.config.wallet.getAddress());

  const { identityId } = await masa.identity.load(address);
  if (!identityId) return [];

  const twoFAs = await loadGreensByIdentityId(masa, identityId);

  if (twoFAs.length === 0) console.log("No Masa Green found");

  let i = 1;
  for (const twoFA of twoFAs) {
    console.log(`Token: ${i}`);
    console.log(`Token ID: ${twoFA.tokenId}`);
    i++;
    if (twoFA.metadata) {
      console.log(`Metadata: ${JSON.stringify(twoFA.metadata, null, 2)}`);
    }
  }

  return twoFAs;
};
