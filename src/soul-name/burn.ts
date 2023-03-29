import Masa from "../masa";
import { Messages } from "../utils";

export const burnSoulNameByName = async (
  masa: Masa,
  soulName: string
): Promise<boolean> => {
  const [soulNameData, extension] = await Promise.all([
    masa.contracts.soulName.getSoulnameData(soulName),
    masa.contracts.instances.SoulNameContract.extension(),
  ]);

  if (soulNameData.exists) {
    console.log(
      `Burning '${soulName}${extension}' with token ID '${soulNameData.tokenId}'!`
    );

    try {
      const { wait, hash } =
        await masa.contracts.instances.SoulNameContract.connect(
          masa.config.wallet
        ).burn(soulNameData.tokenId);

      console.log(Messages.WaitingToFinalize(hash));
      await wait();

      console.log(
        `Burned Soulname '${soulName}${extension}' with ID '${soulNameData.tokenId}'!`
      );

      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Burning Soulname '${soulName}${extension}' Failed! ${error.message}`
        );
      }
    }
  } else {
    console.error(`Soulname '${soulName}${extension}' does not exist!`);
  }

  return false;
};

export const burnSoulName = async (masa: Masa, soulName: string) => {
  const extension = await masa.contracts.instances.SoulNameContract.extension();

  if (soulName.endsWith(extension)) {
    soulName = soulName.replace(extension, "");
  }

  const { identityId, address } = await masa.identity.load();
  if (!identityId) {
    console.error(Messages.NoIdentity(address));
    return false;
  }

  return burnSoulNameByName(masa, soulName);
};
