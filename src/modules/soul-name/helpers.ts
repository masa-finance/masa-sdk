import GraphemeSplitter from "grapheme-splitter";

import type { MasaInterface, SoulNameDetails } from "../../interface";
import { logger } from "../../utils";

export const printSoulName = (
  soulName: SoulNameDetails,
  index?: number,
  verbose: boolean = false,
): void => {
  logger("log", "\n");

  if (index) {
    logger("log", `Token: ${index + 1}`);
  }

  logger("log", `Token ID: '${soulName.tokenDetails.tokenId.toNumber()}'`);
  logger("log", `Name: '${soulName.tokenDetails.sbtName}'`);
  logger("log", `Extension: '${soulName.tokenDetails.extension}'`);
  logger("log", `Owner Address: '${soulName.owner}'`);
  logger(
    "log",
    `Owner Identity ID: '${soulName.tokenDetails.identityId.toNumber()}'`,
  );
  logger("log", `Active: ${soulName.tokenDetails.active}`);
  logger("log", `Metadata URL: '${soulName.tokenUri}'`);

  if (soulName.metadata && verbose) {
    logger("log", `Metadata: ${JSON.stringify(soulName.metadata, null, 2)}`);
  }

  logger(
    "log",
    `Expiry Date: ${new Date(
      soulName.tokenDetails.expirationDate.toNumber() * 1000,
    ).toUTCString()}`,
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
