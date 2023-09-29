import { Messages } from "../../collections";
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

  const tokenId =
    await masa.contracts.instances.SoulNameContract.getTokenId(soulName);

  const { wait, hash } =
    await masa.contracts.instances.SoulNameContract.renewYearsPeriod(
      tokenId,
      years,
    );

  console.log(
    Messages.WaitingToFinalize(
      hash,
      masa.config.network?.blockExplorerUrls?.[0],
    ),
  );

  await wait();

  return true;
};
