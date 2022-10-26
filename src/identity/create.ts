import Masa from "../masa";
import { PaymentMethod } from "../contracts";

export const purchaseIdentityWithSoulname = async (
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

      const tx = await masa.contracts.service.purchaseIdentityAndName(
        identityContracts,
        masa.config.wallet,
        soulName,
        paymentMethod,
        duration,
        metadataUrl
      );

      console.log("Waiting for transaction to finalize");
      const result = await tx.wait();

      console.log(result);
    }
  } else {
    console.error(`Soulname ${soulName}.soul already taken.`);
  }
};

export const createIdentity = async (
  masa: Masa,
  soulName: string,
  duration: number,
  paymentMethod: PaymentMethod
): Promise<boolean> => {
  let identityCreated = false;

  if (await masa.session.checkLogin()) {
    if (soulName.endsWith(".soul")) {
      soulName = soulName.replace(".soul", "");
    }

    const address = await masa.config.wallet.getAddress();
    const identityId = await masa.identity.load(address);

    if (identityId) {
      console.error("Identity already created!");
      return identityCreated;
    }

    await purchaseIdentityWithSoulname(masa, soulName, duration, paymentMethod);

    identityCreated = true;
  } else {
    console.log("Not logged in please login first");
  }

  return identityCreated;
};
