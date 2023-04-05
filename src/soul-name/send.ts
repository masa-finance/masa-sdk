import Masa from "../masa";

export const sendSoulName = async (
  masa: Masa,
  soulName: string,
  receiver: string
): Promise<boolean> => {
  const extension = await masa.contracts.instances.SoulNameContract.extension();

  if (soulName.endsWith(extension)) {
    soulName = soulName.replace(extension, "");
  }

  return masa.contracts.soulName.transfer(soulName, receiver);
};
