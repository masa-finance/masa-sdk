import Masa from "../masa";
import { BigNumber } from "ethers";
import { ISoulName } from "../interface";

export interface SoulNameDetails {
  owner: string;
  tokenUri: string;
  tokenDetails: {
    sbtName: string;
    linked: boolean;
    identityId: BigNumber;
    tokenId: BigNumber;
    expirationDate: BigNumber;
    active: boolean;
  };
  metadata: ISoulName;
}

export const loadSoulNameByTokenId = async (
  masa: Masa,
  tokenId: string | BigNumber
): Promise<SoulNameDetails | undefined> => {
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
      `Failed to load Soul Name with TokenID ${tokenId.toString()}`,
      err.message
    );
  }
};

export const loadSoulNameByName = async (
  masa: Masa,
  soulName: string
): Promise<SoulNameDetails | undefined> => {
  try {
    const tokenId = await masa.contracts.identity.SoulNameContract.getTokenId(
      soulName
    );

    return await loadSoulNameByTokenId(masa, tokenId);
  } catch (err: any) {
    console.error(`Failed to load Soul Name '${soulName}'`);
  }
};

export const loadSoulNamesByName = async (
  masa: Masa,
  soulNames: string[]
): Promise<SoulNameDetails[]> => {
  const soulNameDetails: (SoulNameDetails | undefined)[] = await Promise.all(
    soulNames.map((soulName) => loadSoulNameByName(masa, soulName))
  );

  return soulNameDetails.filter((sn) => !!sn) as SoulNameDetails[];
};

export const loadSoulNamesByIdentityId = async (
  masa: Masa,
  identityId: BigNumber
): Promise<SoulNameDetails[]> => {
  const soulNames = await masa.contracts.identity.SoulNameContract[
    "getSoulNames(uint256)"
  ](identityId);

  return loadSoulNamesByName(masa, soulNames);
};

export const loadSoulNamesByAddress = async (
  masa: Masa,
  address: string
): Promise<SoulNameDetails[]> => {
  const soulNames = await masa.contracts.identity.SoulNameContract[
    "getSoulNames(address)"
  ](address);

  return loadSoulNamesByName(masa, soulNames);
};

export const printSoulName = (soulName: SoulNameDetails, index?: number) => {
  console.log("\n");

  if (index) {
    console.log(`Token: ${index + 1}`);
  }

  console.log(`Name: ${soulName.tokenDetails.sbtName}`);
  console.log(`Token ID: ${soulName.tokenDetails.tokenId.toNumber()}`);
  console.log(`Owner Address: ${soulName.owner}`);
  console.log(
    `Owner Identity ID: ${soulName.tokenDetails.identityId.toNumber()}`
  );
  console.log(`Active: ${soulName.tokenDetails.active}`);
  console.log(`Metadata URL: '${soulName.tokenUri}'`);

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

  if (soulNames.length > 0) {
    let index = 0;
    for (const soulName of soulNames) {
      printSoulName(soulName, index);
      index++;
    }
  } else {
    console.error("No soulnames found!");
  }

  return soulNames;
};
