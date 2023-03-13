import Masa from "../masa";
import { BigNumber } from "ethers";
import { ISoulName } from "../interface";

export interface SoulNameDetails {
  owner: string;
  tokenUri: string;
  tokenDetails: {
    sbtName: string;
    extension: string;
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
    const [tokenDetails, owner, tokenUri, extension] = await Promise.all([
      masa.contracts.instances.SoulNameContract.getTokenData(
        (
          await masa.contracts.instances.SoulNameContract.tokenData(tokenId)
        ).name
      ),
      masa.contracts.instances.SoulNameContract.ownerOf(tokenId),
      masa.contracts.instances.SoulNameContract["tokenURI(uint256)"](tokenId),
      masa.contracts.instances.SoulNameContract.extension(),
    ]);

    const metadata = (await masa.arweave.loadTransactionData(
      tokenUri.replace(masa.soulName.getSoulNameMetadataPrefix(), "")
    )) as ISoulName;

    return {
      owner,
      tokenUri,
      tokenDetails: { ...tokenDetails, extension },
      metadata,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Failed to load Soul Name with TokenID ${tokenId.toString()}`,
        error.message
      );
    }
  }
};

export const loadSoulNameByName = async (
  masa: Masa,
  soulName: string
): Promise<SoulNameDetails | undefined> => {
  try {
    const tokenId = await masa.contracts.instances.SoulNameContract.getTokenId(
      soulName
    );

    return await loadSoulNameByTokenId(masa, tokenId);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to load Soul Name '${soulName}'`, error.message);
    }
  }
};

export const resolve = async (
  masa: Masa,
  soulName: string
): Promise<string | undefined> => {
  let owner;

  try {
    const extension =
      await masa.contracts.instances.SoulNameContract.extension();
    const cleansedSoulname = soulName.replace(extension, "");
    const tokenId = await masa.contracts.instances.SoulNameContract.getTokenId(
      cleansedSoulname
    );
    owner = masa.contracts.instances.SoulNameContract.ownerOf(tokenId);
  } catch (error) {
    if (error instanceof Error && masa.config.verbose) {
      console.error(error.message);
    }
  }

  return owner;
};

export const loadSoulNamesByNames = async (
  masa: Masa,
  soulNames: string[]
): Promise<SoulNameDetails[]> => {
  return (
    await Promise.all(
      soulNames.map((soulName: string) => loadSoulNameByName(masa, soulName))
    )
  ).filter(
    (soulName: SoulNameDetails | undefined) => !!soulName
  ) as SoulNameDetails[];
};

export const loadSoulNamesByIdentityId = async (
  masa: Masa,
  identityId: BigNumber
): Promise<SoulNameDetails[]> => {
  const soulNames = await masa.contracts.instances.SoulNameContract[
    "getSoulNames(uint256)"
  ](identityId);

  return loadSoulNamesByNames(masa, soulNames);
};

export const loadSoulNamesByAddress = async (
  masa: Masa,
  address: string
): Promise<string[]> => {
  let soulNames: string[] = [];

  try {
    soulNames = await masa.contracts.instances.SoulNameContract[
      "getSoulNames(address)"
    ](address);
  } catch {
    // ignore
  }

  return soulNames;
};

export const loadSoulNameDetailsByAddress = async (
  masa: Masa,
  address: string
) => {
  return await loadSoulNamesByNames(
    masa,
    await loadSoulNamesByAddress(masa, address)
  );
};
export const printSoulName = (soulName: SoulNameDetails, index?: number) => {
  console.log("\n");

  if (index) {
    console.log(`Token: ${index + 1}`);
  }

  console.log(`Token ID: ${soulName.tokenDetails.tokenId.toNumber()}`);
  console.log(`Name: ${soulName.tokenDetails.sbtName}`);
  console.log(`Extension: ${soulName.tokenDetails.extension}`);
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

  const soulNames = await loadSoulNameDetailsByAddress(masa, address);

  if (soulNames.length > 0) {
    let index = 0;
    for (const soulName of soulNames) {
      printSoulName(soulName, index);
      index++;
    }
  } else {
    console.error(`No soulnames found for '${address}'`);
  }

  return soulNames;
};
