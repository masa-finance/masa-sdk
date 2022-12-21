import Masa from "../masa";
import { BigNumber } from "ethers";
import { ISoulName } from "../interface";

export const loadSoulNameByName = async (masa: Masa, soulName: string) => {
  try {
    const tokenId = await masa.contracts.identity.SoulNameContract.getTokenId(
      soulName
    );

    return await loadSoulNameByTokenId(masa, tokenId);
  } catch (err: any) {
    console.error(`Failed to load Soul Name '${soulName}'`);
  }
};

export const loadSoulNameByTokenId = async (
  masa: Masa,
  tokenId: string | BigNumber
) => {
  try {
    const [tokenDetails, owner, tokenUri] = await Promise.all([
      masa.contracts.identity.SoulNameContract.getTokenData(
        (
          await masa.contracts.identity.SoulNameContract.tokenData(tokenId)
        ).name
      ),
      masa.contracts.identity.SoulNameContract.ownerOf(tokenId),
      masa.contracts.identity.SoulNameContract["tokenURI(uint256)"](tokenId),
    ]);

    const metadata = (await masa.arweave.loadTransactionData(
      tokenUri.replace("ar://", "")
    )) as ISoulName;

    return {
      owner,
      tokenUri,
      tokenDetails,
      metadata,
    };
  } catch (err: any) {
    console.error(
      `Failed to load Soul Name with TokenID ${tokenId.toString}`,
      err.message
    );
  }
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
