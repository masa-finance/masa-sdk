import Masa from "../masa";
import { BigNumber } from "ethers";
import { ISoulName } from "../interface";

export const loadSoulNameByName = async (masa: Masa, soulName: string) => {
  const tokenId = await masa.contracts.identity.SoulNameContract.getTokenId(
    soulName
  );

  return loadSoulNameByTokenId(masa, tokenId);
};

export const loadSoulNameByTokenId = async (
  masa: Masa,
  tokenId: string | BigNumber
) => {
  const tokenDetails =
    await masa.contracts.identity.SoulNameContract.getTokenData(
      (
        await masa.contracts.identity.SoulNameContract.tokenData(tokenId)
      ).name
    );

  const owner = await masa.contracts.identity.SoulNameContract.ownerOf(tokenId);

  const tokenUri = await masa.contracts.identity.SoulNameContract[
    "tokenURI(uint256)"
  ](tokenId);

  let metadata;
  try {
    const metadataResponse = await masa.arweave.transactions
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
  const soulNames = await masa.contracts.identity.SoulNameContract[
    "getSoulNames(uint256)"
  ](identityId);

  return await Promise.all(
    soulNames.map(async (soulName, index) => {
      const details = await loadSoulNameByName(masa, soulName);

      return {
        index,
        ...details,
      };
    })
  );
};

export const loadSoulNamesByAddress = async (masa: Masa, address: string) => {
  const soulNames = await masa.contracts.identity.SoulNameContract[
    "getSoulNames(address)"
  ](address);

  return await Promise.all(
    soulNames.map(async (soulName, index) => {
      const details = await loadSoulNameByName(masa, soulName);

      return {
        index,
        ...details,
      };
    })
  );
};

export const printSoulName = (soulName: any) => {
  console.log("\n");

  if (soulName.index) {
    console.log(`Token: ${soulName.index + 1}`);
  }

  console.log(`Name: ${soulName.tokenDetails.sbtName}`);
  console.log(`Token ID: ${soulName.tokenDetails.tokenId.toNumber()}`);
  console.log(`Owner Address: ${soulName.owner}`);
  console.log(
    `Owner Identity ID: ${soulName.tokenDetails.identityId.toNumber()}`
  );
  console.log(`Active: ${soulName.tokenDetails.active}`);
  console.log(`Metadata URL: ${soulName.tokenUri}`);

  if (soulName.metadata) {
    console.log(
      `Loaded Metadata: ${JSON.stringify(soulName.metadata, null, 2)}`
    );
  }

  console.log(
    `Expiry Date: ${new Date(
      soulName.tokenDetails.expirationDate.toNumber() * 1000
    ).toUTCString()}`
  );
};

export const listSoulNames = async (masa: Masa, address?: string) => {
  address = address || (await masa.config.wallet.getAddress());

  const soulNames = await loadSoulNamesByAddress(masa, address);

  for (const soulName of soulNames) {
    printSoulName(soulName);
  }

  return soulNames;
};
