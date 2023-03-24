import Masa from "../masa";
import { Messages } from "../utils";

export const burnSoulNameByName = async (masa: Masa, soulName: string) => {
  const soulNameData = await masa.contracts.soulName.getSoulnameData(soulName);

  if (soulNameData.exists) {
    console.log(
      `Burning '${soulName}.soul' with token ID '${soulNameData.tokenId}'!`
    );

    try {
      const { wait, hash } =
        await masa.contracts.instances.SoulNameContract.connect(
          masa.config.wallet
        ).burn(soulNameData.tokenId);

      console.log(Messages.WaitingToFinalize(hash));
      await wait();

      console.log(
        `Soulname '${soulName}.soul' with token ID '${soulNameData.tokenId}' burned!`
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Burning of Soulname '${soulName}.soul' Failed! ${error.message}`
        );
      }
    }
  } else {
    console.error(`Soulname '${soulName}.soul' does not exist!`);
  }
};

export const burnSoulName = async (masa: Masa, soulName: string) => {
  if (await masa.session.checkLogin()) {
    const extension =
      await masa.contracts.instances.SoulNameContract.extension();

    if (soulName.endsWith(extension)) {
      soulName = soulName.replace(extension, "");
    }

    const { identityId } = await masa.identity.load();
    if (!identityId) return;

    await burnSoulNameByName(masa, soulName);
  } else {
    console.error(Messages.NotLoggedIn());
  }
};
