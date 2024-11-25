import type { GreenDetails, MasaInterface } from "../../interface";
import { isSigner } from "../../utils";
import { loadGreens } from "./load";

export const listGreens = async (
  masa: MasaInterface,
  address?: string,
): Promise<GreenDetails[]> => {
  if (!isSigner(masa.config.signer)) {
    return [];
  }

  address = address || (await masa.config.signer.getAddress());
  return loadGreens(masa, address);
};

export const listGreensAndPrint = async (
  masa: MasaInterface,
  address?: string,
): Promise<GreenDetails[]> => {
  const greens: GreenDetails[] = await listGreens(masa, address);

  if (greens.length === 0) {
    console.warn("No Masa Green found");
  }

  let i = 1;
  for (const green of greens) {
    console.log(`Token: ${i}`);
    console.log(`Token ID: ${green.tokenId}`);
    i++;
    if (green.metadata) {
      console.log(`Metadata: ${JSON.stringify(green.metadata, null, 2)}`);
    }
  }

  return greens;
};
