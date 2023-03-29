import Masa from "../masa";
import { Messages } from "../utils";

export const sendSoulNameByName = async (
  masa: Masa,
  soulName: string,
  receiver: string
): Promise<boolean> => {
  const soulNameData = await masa.contracts.soulName.getSoulnameData(soulName);
  const extension = await masa.contracts.instances.SoulNameContract.extension();

  if (soulNameData.exists) {
    console.log(
      `Sending '${soulName}${extension}' with token ID '${soulNameData.tokenId}' to '${receiver}'!`
    );

    try {
      const { wait, hash } =
        await masa.contracts.instances.SoulNameContract.connect(
          masa.config.wallet
        ).transferFrom(
          masa.config.wallet.getAddress(),
          receiver,
          soulNameData.tokenId
        );

      console.log(Messages.WaitingToFinalize(hash));
      await wait();

      console.log(
        `Soulname '${soulName}${extension}' with token ID '${soulNameData.tokenId}' sent!`
      );

      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Sending of Soul Name Failed! ${error.message}`);
      }
    }
  } else {
    console.error(`Soulname '${soulName}${extension}' does not exist!`);
  }

  return false;
};

export const sendSoulName = async (
  masa: Masa,
  soulName: string,
  receiver: string
): Promise<boolean> => {
  const extension = await masa.contracts.instances.SoulNameContract.extension();

  if (soulName.endsWith(extension)) {
    soulName = soulName.replace(extension, "");
  }

  const { identityId, address } = await masa.identity.load();
  if (!identityId) {
    console.error(Messages.NoIdentity(address));
    return false;
  }

  return sendSoulNameByName(masa, soulName, receiver);
};
