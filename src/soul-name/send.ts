import Masa from "../masa";
import { Messages } from "../utils";

export const sendSoulNameByName = async (
  masa: Masa,
  soulName: string,
  receiver: string
) => {
  const soulNameData = await masa.contracts.soulName.getSoulnameData(soulName);

  if (soulNameData.exists) {
    console.log(
      `Sending '${soulName}.soul' with token ID '${soulNameData.tokenId}' to '${receiver}'!`
    );

    try {
      const tx = await masa.contracts.instances.SoulNameContract.connect(
        masa.config.wallet
      ).transferFrom(
        masa.config.wallet.getAddress(),
        receiver,
        soulNameData.tokenId
      );

      console.log(Messages.WaitingToFinalize(tx.hash));
      await tx.wait();

      console.log(
        `Soulname '${soulName}.soul' with token ID '${soulNameData.tokenId}' sent!`
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Sending of Soul Name Failed! ${error.message}`);
      }
    }
  } else {
    console.error(`Soulname '${soulName}.soul' does not exist!`);
  }
};

export const sendSoulName = async (
  masa: Masa,
  soulName: string,
  receiver: string
) => {
  if (await masa.session.checkLogin()) {
    if (soulName.endsWith(".soul")) {
      soulName = soulName.replace(".soul", "");
    }

    const { identityId } = await masa.identity.load();
    if (!identityId) return;

    await sendSoulNameByName(masa, soulName, receiver);
  } else {
    console.error(Messages.NotLoggedIn());
  }
};
