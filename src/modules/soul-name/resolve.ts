import type { MasaInterface } from "../../interface";
import { logger } from "../../utils";

/**
 *
 * @param masa
 * @param soulName
 */
export const resolveSoulName = async (
  masa: MasaInterface,
  soulName: string,
): Promise<string | undefined> => {
  let owner;

  try {
    const extension =
      await masa.contracts.instances.SoulNameContract.extension();
    const cleansedSoulname = soulName.replace(extension, "");
    const tokenId =
      await masa.contracts.instances.SoulNameContract.getTokenId(
        cleansedSoulname,
      );
    owner = masa.contracts.instances.SoulNameContract.ownerOf(tokenId);
  } catch (error: unknown) {
    if (error instanceof Error && masa.config.verbose) {
      logger("error", `Resolving soul name failed: ${error.message}`);
    }
  }

  return owner;
};
