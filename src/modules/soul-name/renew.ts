import type { BaseResult, MasaInterface } from "../../interface";

export const renewSoulName = async (
  masa: MasaInterface,
  soulName: string,
  years: number,
): Promise<BaseResult> => {
  const extension = await masa.contracts.instances.SoulNameContract.extension();

  if (soulName.endsWith(extension)) {
    soulName = soulName.replace(extension, "");
  }

  return masa.contracts.soulName.renew(soulName, years);
};
