import GraphemeSplitter from "grapheme-splitter";

import type { MasaInterface, SoulNameDetails } from "../interface";

export const printSoulName = (
  soulName: SoulNameDetails,
  index?: number,
  verbose: boolean = false
): void => {
  console.log("\n");

  if (index) {
    console.log(`Token: ${index + 1}`);
  }

  console.log(`Token ID: '${soulName.tokenDetails.tokenId.toNumber()}'`);
  console.log(`Name: '${soulName.tokenDetails.sbtName}'`);
  console.log(`Extension: '${soulName.tokenDetails.extension}'`);
  console.log(`Owner Address: '${soulName.owner}'`);
  console.log(
    `Owner Identity ID: '${soulName.tokenDetails.identityId.toNumber()}'`
  );
  console.log(`Active: ${soulName.tokenDetails.active}`);
  console.log(`Metadata URL: '${soulName.tokenUri}'`);

  if (soulName.metadata && verbose) {
    console.log(`Metadata: ${JSON.stringify(soulName.metadata, null, 2)}`);
  }

  console.log(
    `Expiry Date: ${new Date(
      soulName.tokenDetails.expirationDate.toNumber() * 1000
    ).toUTCString()}`
  );
};

export const calculateSoulNameLength = (soulName: string): number => {
  return new GraphemeSplitter().countGraphemes(soulName);
};

/**
 * try to evaluate the right prefix
 * @param masa
 */
export const getSoulNameMetadataPrefix = (masa: MasaInterface): string => {
  // special handling for celo networks
  return masa.config.networkName === "ethereum" ||
    masa.config.networkName === "goerli"
    ? "ar://"
    : "https://arweave.net/";
};
