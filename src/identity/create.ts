import Masa from "../masa";
import { PaymentMethod } from "../contracts";

export const purchaseIdentity = async (masa: Masa) => {
  const tx = await masa.contracts.purchaseIdentity(masa.config.wallet);

  console.log("Waiting for transaction to finalize");
  const result = await tx.wait();

  console.log(result);
};

export const purchaseIdentityWithSoulName = async (
  masa: Masa,
  soulName: string,
  soulNameLength: number,
  duration: number,
  paymentMethod: PaymentMethod
) => {
  if (await masa.contracts.isAvailable(soulName)) {
    console.log("Writing metadata");
    const storeMetadataData = await masa.metadata.store(
      soulName,
      await masa.config.wallet.getAddress(),
      duration
    );

    if (storeMetadataData) {
      const metadataUrl = `ar://${storeMetadataData.metadataTransaction.id}`;
      console.log(`Matadata URL: ${metadataUrl}`);

      const tx = await masa.contracts.purchaseIdentityAndName(
        masa.config.wallet,
        paymentMethod,
        soulName,
        soulNameLength,
        duration,
        metadataUrl,
        storeMetadataData.authorityAddress,
        storeMetadataData.signature
      );

      console.log("Waiting for transaction to finalize");
      const result = await tx.wait();

      console.log(result);
    }
  } else {
    console.error(`Soulname ${soulName}.soul already taken.`);
  }
};

export const createIdentity = async (masa: Masa): Promise<boolean> => {
  let identityCreated = false;

  const { identityId } = await masa.identity.load();

  if (identityId) {
    console.error(`Identity already created! '${identityId}'`);
    return identityCreated;
  }

  await purchaseIdentity(masa);

  identityCreated = true;
  return identityCreated;
};

export const createIdentityWithSoulName = async (
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

    const { isValid, length } = masa.soulName.validate(soulName);

    if (!isValid) {
      console.error("Soulname not valid!");
      return identityCreated;
    }

    const address = await masa.config.wallet.getAddress();
    const { identityId } = await masa.identity.load(address);

    if (identityId) {
      console.error(`Identity already created! '${identityId}'`);
      return identityCreated;
    }

    await purchaseIdentityWithSoulName(
      masa,
      soulName,
      length,
      duration,
      paymentMethod
    );

    identityCreated = true;
  } else {
    console.log("Not logged in please login first");
  }

  return identityCreated;
};
