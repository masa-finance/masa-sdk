import Masa from "../masa";
import { BigNumber } from "ethers";
import { ISoulName } from "../interface";

export const loadSoulNameByName = async (masa: Masa, soulName: string) => {
  const identityContracts = await masa.contracts.loadIdentityContracts();

  const tokenDetails = await identityContracts.SoulNameContract.getTokenData(
    soulName
  );

  const owner = await identityContracts.SoulNameContract.ownerOf(
    tokenDetails.tokenId
  );

  const tokenUri = await identityContracts.SoulNameContract[
    "tokenURI(uint256)"
  ](tokenDetails.tokenId);

  let metadata;
  try {
    const metadataResponse = await masa.arweaveClient.transactions
      .getData(tokenUri.replace("ar://", ""), {
        decode: true,
        string: true,
      })
      .catch(() => {
        // ignore
      });

    metadata = JSON.parse(metadataResponse as string) as ISoulName;
  } catch {
    // ignore
  }

  return {
    owner,
    tokenUri,
    tokenDetails,
    metadata,
  };
};

export const loadSoulNamesByIdentityId = async (
  masa: Masa,
  identityId: BigNumber
) => {
  const identityContracts = await masa.contracts.loadIdentityContracts();

  const soulNames = await identityContracts.SoulNameContract[
    "getSoulNames(uint256)"
  ](identityId);

  return await Promise.all(
    soulNames.map(async (soulName, index) => {
      const { tokenUri, tokenDetails, metadata } = await loadSoulNameByName(
        masa,
        soulName
      );

      return {
        index,
        tokenUri,
        tokenDetails,
        metadata,
      };
    })
  );
};

export const listSoulNames = async (masa: Masa, address?: string) => {
  address = address || (await masa.config.wallet.getAddress());

  // load identity
  const identityId = await masa.identity.load(address);
  if (!identityId) return;

  const soulNames = await loadSoulNamesByIdentityId(masa, identityId);

  for (const soulName of soulNames) {
    console.log(`\nToken: ${soulName.index + 1}`);
    console.log(`Name: ${soulName.tokenDetails.sbtName}`);
    console.log(`Token ID: ${soulName.tokenDetails.tokenId.toNumber()}`);
    console.log(`Identity ID: ${soulName.tokenDetails.identityId.toNumber()}`);
    console.log(`Active: ${soulName.tokenDetails.active}`);
    console.log(`Metadata Uri: ${soulName.tokenUri}`);
    if (soulName.metadata)
      console.log(`Metadata: ${JSON.stringify(soulName.metadata, null, 2)}`);

    console.log(
      `Expiry Date: ${new Date(
        soulName.tokenDetails.expirationDate.toNumber() * 1000
      ).toUTCString()}`
    );
  }

  return soulNames;
};
