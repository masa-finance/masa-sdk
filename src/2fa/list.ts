import { BigNumber } from "ethers";
import Masa from "../masa";
import { I2FA } from "../interface";
import { patchMetadataUrl } from "../helpers";

export const load2fasByIdentityId = async (
  masa: Masa,
  identityId: BigNumber
): Promise<
  {
    tokenId: BigNumber;
    tokenUri: string;
    metadata: I2FA;
  }[]
> => {
  const twoFAs = [];
  const identityContracts = await masa.contracts.loadIdentityContracts();

  const twofaIds: BigNumber[] = await identityContracts.SoulLinkerContract[
    "getSBTLinks(uint256,address)"
  ](identityId, identityContracts.Soulbound2FA.address);

  for (const tokenId of twofaIds) {
    const tokenUri = patchMetadataUrl(
      masa,
      await identityContracts.Soulbound2FA.tokenURI(tokenId)
    );

    const metadata = (await masa.metadata.retrieve(tokenUri)) as I2FA;

    twoFAs.push({
      tokenId,
      tokenUri,
      metadata,
    });
  }

  return twoFAs;
};

export const list2fas = async (
  masa: Masa,
  address?: string
): Promise<
  | {
      tokenId: BigNumber;
      tokenUri: string;
      metadata: I2FA;
    }[]
  | undefined
> => {
  address = address || (await masa.config.wallet.getAddress());

  const identityId = await masa.identity.load(address);
  if (!identityId) return;

  const twofas = await load2fasByIdentityId(masa, identityId);

  if (twofas.length === 0) console.log("No 2FAs found");

  let i = 1;
  for (const twofa of twofas) {
    console.log(`Token: ${i}`);
    i++;
    console.log(`Metadata: ${JSON.stringify(twofa.metadata, null, 2)}`);
  }

  return twofas;
};
