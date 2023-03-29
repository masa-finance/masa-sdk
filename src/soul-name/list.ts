import Masa from "../masa";
import { SoulNameDetails } from "../interface";
import { loadSoulNameDetailsByAddress } from "./load";
import { printSoulName } from "./helpers";

export const listSoulNames = async (
  masa: Masa,
  address?: string
): Promise<SoulNameDetails[]> => {
  address = address || (await masa.config.wallet.getAddress());
  return await loadSoulNameDetailsByAddress(masa, address);
};

export const listSoulNamesAndPrint = async (
  masa: Masa,
  address?: string
): Promise<SoulNameDetails[]> => {
  const soulNames = await listSoulNames(masa, address);

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
