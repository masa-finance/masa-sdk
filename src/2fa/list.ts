import { BigNumber } from "ethers";
import Masa from "../masa";
import { I2FA } from "../interface";
import { patchMetadataUrl } from "../helpers";

export const load2FAsByIdentityId = async (
  masa: Masa,
  identityId: BigNumber
): Promise<
  {
    tokenId: BigNumber;
    tokenUri: string;
    metadata?: I2FA;
  }[]
> => {
  const twoFSIds: BigNumber[] =
    await masa.contracts.identity.SoulLinkerContract[
      "getSBTLinks(uint256,address)"
    ](identityId, masa.contracts.identity.Soulbound2FAContract.address);

  return await Promise.all(
    twoFSIds.map(async (tokenId) => {
      const tokenUri = patchMetadataUrl(
        masa,
        await masa.contracts.identity.Soulbound2FAContract.tokenURI(tokenId)
      );

      const metadata = <I2FA | undefined>await masa.metadata.retrieve(tokenUri);

      return {
        tokenId,
        tokenUri,
        metadata,
      };
    })
  );
};

export const list2FAs = async (
  masa: Masa,
  address?: string
): Promise<
  {
    tokenId: BigNumber;
    tokenUri: string;
    metadata?: I2FA;
  }[]
> => {
  address = address || (await masa.config.wallet.getAddress());

  const { identityId } = await masa.identity.load(address);
  if (!identityId) return [];

  const twoFAs = await load2FAsByIdentityId(masa, identityId);

  if (twoFAs.length === 0) console.log("No 2FAs found");

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
