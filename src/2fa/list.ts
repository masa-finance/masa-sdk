import { BigNumber } from "ethers";
import Masa from "../masa";
import { I2fa } from "../interface";
import { patchMetadataUrl } from "../helpers";

export const load2faByIdentityId = async (
  masa: Masa,
  twofaId: BigNumber
): Promise<
  {
    tokenId: BigNumber;
    tokenUri: string;
    metadata: I2fa;
  }[]
> => {
  const twofas = [];
  const identityContracts = await masa.contracts.loadIdentityContracts();

  const twofaIds: BigNumber[] = await identityContracts.SoulLinkerContract[
    "getSBTLinks(uint256,address)"
  ](twofaId, identityContracts.Soulbound2FA.address);

  for (const tokenId of twofaIds) {
    const tokenUri = patchMetadataUrl(
      masa,
      await identityContracts.Soulbound2FA.tokenURI(tokenId)
    );

    console.log(`Metadata Url: ${tokenUri}`);
    const metadata = (await masa.metadata.retrieve(tokenUri)) as I2fa;

    twofas.push({
      tokenId,
      tokenUri,
      metadata,
    });
  }

  return twofas;
};

export const list2fas = async (
  masa: Masa,
  address?: string
): Promise<
  | {
      tokenId: BigNumber;
      tokenUri: string;
      metadata: I2fa;
    }[]
  | undefined
> => {
  if (await masa.session.checkLogin()) {
    address = address || (await masa.config.wallet.getAddress());

    const identityId = await masa.identity.load(address);
    if (!identityId) return;

    const twofas = await load2faByIdentityId(masa, identityId);

    if (twofas.length === 0) console.log("No 2fas found");

    for (const twofa of twofas) {
      console.log(`Metadata: ${JSON.stringify(twofa.metadata, null, 2)}`);
    }

    return twofas;
  } else {
    console.log("Not logged in please login first");
  }
};
