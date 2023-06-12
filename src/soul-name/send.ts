import type { MasaInterface } from "../interface";

export const sendSoulName = async (
  masa: MasaInterface,
  soulName: string,
  receiver: string
): Promise<boolean> => {
  const extension = await masa.contracts.instances.SoulNameContract.extension();

  if (soulName.endsWith(extension)) {
    soulName = soulName.replace(extension, "");
  }

  return masa.contracts.soulName.transfer(soulName, receiver);
};
