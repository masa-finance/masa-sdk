import Masa from "../masa";
import { GreenDetails } from "../interface";
import { loadGreensByAddress } from "./";

export const listGreens = async (
  masa: Masa,
  address?: string
): Promise<GreenDetails[]> => {
  address = address || (await masa.config.wallet.getAddress());
  return loadGreensByAddress(masa, address);
};

export const listGreensAndPrint = async (
  masa: Masa,
  address?: string
): Promise<GreenDetails[]> => {
  const greens = await listGreens(masa, address);

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
