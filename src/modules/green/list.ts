import type { GreenDetails, MasaInterface } from "../../interface";
import { logger } from "../../utils";
import { loadGreens } from "./load";

export const listGreens = async (
  masa: MasaInterface,
  address?: string,
): Promise<GreenDetails[]> => {
  address = address ?? (await masa.config.signer.getAddress());
  return loadGreens(masa, address);
};

export const listGreensAndPrint = async (
  masa: MasaInterface,
  address?: string,
): Promise<GreenDetails[]> => {
  const greens: GreenDetails[] = await listGreens(masa, address);

  if (greens.length === 0) {
    logger("warn", "No Masa Green found");
  }

  let i = 1;
  for (const green of greens) {
    logger("log", `Token: ${i}`);
    logger("log", `Token ID: ${green.tokenId.toNumber()}`);
    i++;
    if (green.metadata) {
      logger("log", `Metadata: ${JSON.stringify(green.metadata, null, 2)}`);
    }
  }

  return greens;
};
