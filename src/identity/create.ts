import Masa from "../masa";
import { PaymentMethod } from "../contracts";
import { Messages } from "../utils";

export const purchaseIdentity = async (masa: Masa) => {
  const tx = await masa.contracts.identity.purchase();
  console.log(Messages.WaitingToFinalize(tx.hash));

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
  if (await masa.contracts.soulName.isAvailable(soulName)) {
    const storeMetadataData = await masa.metadata.store(
      soulName,
      await masa.config.wallet.getAddress(),
      duration
    );

    if (storeMetadataData) {
      const metadataUrl = `ar://${storeMetadataData.metadataTransaction.id}`;
      console.log(`Identity Metadata URL: '${metadataUrl}'`);

      const tx = await masa.contracts.identity.purchaseIdentityAndName(
        paymentMethod,
        soulName,
        soulNameLength,
        duration,
        metadataUrl,
        storeMetadataData.authorityAddress,
        storeMetadataData.signature
      );

      console.log(Messages.WaitingToFinalize(tx.hash));
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
    const extension =
      await masa.contracts.instances.SoulNameContract.extension();

    if (soulName.endsWith(extension)) {
      soulName = soulName.replace(extension, "");
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
    console.error(Messages.NotLoggedIn());
  }

  return identityCreated;
};
