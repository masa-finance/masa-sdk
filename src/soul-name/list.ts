import Masa from "../masa";
import { SoulNameDetails } from "../interface";
import { loadSoulNameDetailsByAddress } from "./load";
import { printSoulName } from "./helpers";

/**
 * list soul names
 *
 * @param masa
 * @param address
 */
export const listSoulNames = async (
  masa: Masa,
  address?: string
): Promise<SoulNameDetails[]> => {
  address = address || (await masa.config.signer.getAddress());
  return await loadSoulNameDetailsByAddress(masa, address);
};

/**
 * list soul names and print them
 *
 * @param masa
 * @param address
 */
export const listSoulNamesAndPrint = async (
  masa: Masa,
  address?: string
): Promise<SoulNameDetails[]> => {
  address = address || (await masa.config.signer.getAddress());
  const soulNames = await listSoulNames(masa, address);

  if (soulNames.length > 0) {
    let index = 0;
    for (const soulName of soulNames) {
      printSoulName(soulName, index, masa.config.verbose);
      index++;
    }
  } else {
    console.error(`No soulnames found for '${address}'`);
  }

  return soulNames;
};
