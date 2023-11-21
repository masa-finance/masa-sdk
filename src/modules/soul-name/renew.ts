import type { MasaInterface } from "../../interface";

export const renewSoulName = async (
  masa: MasaInterface,
  soulName: string,
  years: number,
): Promise<boolean> => {
  const extension = await masa.contracts.instances.SoulNameContract.extension();

  if (soulName.endsWith(extension)) {
    soulName = soulName.replace(extension, "");
  }

  return masa.contracts.soulName.renew(soulName, years);
};
