import Masa from "../masa";

export const burnSoulName = async (
  masa: Masa,
  soulName: string
): Promise<boolean> => {
  const extension = await masa.contracts.instances.SoulNameContract.extension();

  if (soulName.endsWith(extension)) {
    soulName = soulName.replace(extension, "");
  }

  return masa.contracts.soulName.burn(soulName);
};
