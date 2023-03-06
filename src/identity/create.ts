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
    const extension =
      await masa.contracts.instances.SoulNameContract.extension();

    const storedSoulNameMetadata = await masa.client.soulName.store(
      `${soulName}${extension}`,
      await masa.config.wallet.getAddress(),
      duration,
      masa.config.network
    );

    if (storedSoulNameMetadata) {
      const soulNameMetadataUrl = `${masa.soulName.getSoulNameMetadataPrefix()}${
        storedSoulNameMetadata.metadataTransaction.id
      }`;
      console.log(`Soul Name Metadata URL: '${soulNameMetadataUrl}'`);

      const tx = await masa.contracts.identity.purchaseIdentityAndName(
        paymentMethod,
        soulName,
        soulNameLength,
        duration,
        soulNameMetadataUrl,
        storedSoulNameMetadata.authorityAddress,
        storedSoulNameMetadata.signature
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
  paymentMethod: PaymentMethod,
  soulName: string,
  duration: number
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
