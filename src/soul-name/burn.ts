import Masa from "../masa";
import { Messages } from "../utils";

export const burnSoulNameByName = async (masa: Masa, soulName: string) => {
  const nameData = await masa.contracts.instances.SoulNameContract.nameData(
    soulName
  );

  if (nameData.exists) {
    console.log(`Burning ${soulName}.soul with id ${nameData.tokenId}!`);

    try {
      const tx = await masa.contracts.instances.SoulNameContract.connect(
        masa.config.wallet
      ).burn(nameData.tokenId);

      console.log(Messages.WaitingToFinalize(tx.hash));
      await tx.wait();

      console.log(`${soulName}.soul with id ${nameData.tokenId} burned!`);
    } catch (err: any) {
      console.error(`Burning of Soul Name Failed! ${err.message}`);
    }
  } else {
    console.error(`Soulname ${soulName}.soul does not exist!`);
  }
};

export const burnSoulName = async (masa: Masa, soulName: string) => {
  if (await masa.session.checkLogin()) {
    if (soulName.endsWith(".soul")) {
      soulName = soulName.replace(".soul", "");
    }

    const { identityId } = await masa.identity.load();
    if (!identityId) return;

    await burnSoulNameByName(masa, soulName);
  } else {
    console.error(Messages.NotLoggedIn());
  }
};
