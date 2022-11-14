import Masa from "../masa";

export const sendSoulNameByName = async (
  masa: Masa,
  soulName: string,
  receiver: string
) => {
  const soulNameData = await masa.contracts.identity.SoulNameContract.nameData(
    soulName
  );

  if (soulNameData.exists) {
    console.log(
      `Sending ${soulName}.soul with id ${soulNameData.tokenId} to ${receiver}!`
    );

    try {
      const tx = await masa.contracts.identity.SoulNameContract.connect(
        masa.config.wallet
      ).transferFrom(
        masa.config.wallet.getAddress(),
        receiver,
        soulNameData.tokenId
      );

      console.log("Waiting for the send tx to finalize");
      await tx.wait();

      console.log(`${soulName}.soul with id ${soulNameData.tokenId} sent!`);
    } catch (err: any) {
      console.error(`Sending of Soul Name Failed! ${err.message}`);
    }
  } else {
    console.error(`Soulname ${soulName}.soul does not exist!`);
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

    const identityId = await masa.identity.load();
    if (!identityId) return;

    await sendSoulNameByName(masa, soulName, receiver);
  } else {
    console.log("Not logged in please login first");
  }
};
