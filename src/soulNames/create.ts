import Masa from "../masa";
import { PaymentMethod } from "../contracts";

const purchaseSoulname = async (
  masa: Masa,
  soulName: string,
  duration: number,
  paymentMethod: PaymentMethod
) => {
  const identityContracts = await masa.contracts.loadIdentityContracts();

  if (await masa.contracts.service.isAvailable(identityContracts, soulName)) {
    console.log("Writing metadata");
    const storeMetadataData = await masa.metadata.store(soulName);

    if (storeMetadataData) {
      const metadataUrl = `ar://${storeMetadataData.metadataTransaction.id}`;
      console.log(`Matadata URL: ${metadataUrl}`);

      const tx = await masa.contracts.service.purchaseName(
        identityContracts,
        masa.config.wallet,
        soulName,
        paymentMethod,
        duration,
        metadataUrl
      );

      console.log("Waiting for transaction to finalize");
      const result = await tx.wait();

      const purchasedEvent = result.events?.find(
        (e) => e.event === "SoulNamePurchased"
      );

      let tokenId;
      if (purchasedEvent && purchasedEvent.decode) {
        const decodedEvent = purchasedEvent.decode(purchasedEvent.data);
        tokenId = decodedEvent.tokenId.toNumber();
      }

      console.log(`Token with ID: ${tokenId} created.`);
    }
  } else {
    console.error(`Soulname ${soulName}.soul already taken.`);
  }
};

export const createSoulName = async (
  masa: Masa,
  soulName: string,
  duration: number,
  paymentMethod: PaymentMethod
) => {
  if (await masa.session.checkLogin()) {
    if (soulName.endsWith(".soul")) {
      soulName = soulName.replace(".soul", "");
    }

    const address = await masa.config.wallet.getAddress();

    const identityId = await masa.identity.load(address);
    if (!identityId) return;

    await purchaseSoulname(masa, soulName, duration, paymentMethod);
  } else {
    console.log("Not logged in please login first");
  }
};
