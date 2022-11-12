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
    metadata: I2FA;
  }[]
> => {
  const identityContracts = await masa.contracts.loadIdentityContracts();

  const twoFSIds: BigNumber[] = await identityContracts.SoulLinkerContract[
    "getSBTLinks(uint256,address)"
  ](identityId, identityContracts.Soulbound2FA.address);

  return await Promise.all(
    twoFSIds.map(async (tokenId) => {
      const tokenUri = patchMetadataUrl(
        masa,
        await identityContracts.Soulbound2FA.tokenURI(tokenId)
      );

      const metadata = (await masa.metadata.retrieve(tokenUri)) as I2FA;

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
    metadata: I2FA;
  }[]
> => {
  address = address || (await masa.config.wallet.getAddress());

  const identityId = await masa.identity.load(address);
  if (!identityId) return [];

  const twoFAs = await load2FAsByIdentityId(masa, identityId);

  if (twoFAs.length === 0) console.log("No 2FAs found");

  let i = 1;
  for (const twoFA of twoFAs) {
    console.log(`Token: ${i}`);
    i++;
    console.log(`Metadata: ${JSON.stringify(twoFA.metadata, null, 2)}`);
  }

  return twoFAs;
};
