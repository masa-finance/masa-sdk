import Masa from "../masa";
import { PaymentMethod } from "../contracts";
import { Messages } from "../utils";
import { Event } from "ethers";
import { CreateSoulNameResult } from "../interface";

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
): Promise<{ tokenId: string; soulName: string } | undefined> => {
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

      const purchasedEvent = result.events?.find(
        (event: Event) => event.event === "SoulboundIdentityAndNamePurchased"
      );

      let tokenId;
      if (purchasedEvent && purchasedEvent.decode) {
        const decodedEvent = purchasedEvent.decode(purchasedEvent.data);
        tokenId = decodedEvent.tokenId.toNumber();
        console.log(`Token with ID: '${tokenId}' created.`);
        return {
          tokenId,
          soulName,
        };
      }
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
): Promise<CreateSoulNameResult | undefined> => {
  const result: CreateSoulNameResult = {
    success: false,
    message: "Unknown Error",
  };

  if (await masa.session.checkLogin()) {
    const extension =
      await masa.contracts.instances.SoulNameContract.extension();

    if (soulName.endsWith(extension)) {
      soulName = soulName.replace(extension, "");
    }

    const { isValid, length } = masa.soulName.validate(soulName);

    if (!isValid) {
      result.message = "Soulname not valid!";
      console.error(result.message);
      return result;
    }

    const address = await masa.config.wallet.getAddress();
    const { identityId } = await masa.identity.load(address);

    if (identityId) {
      result.message = `Identity already created! '${identityId}'`;
      console.error(result.message);
      return result;
    }

    const soulNameInstance = await purchaseIdentityWithSoulName(
      masa,
      soulName,
      length,
      duration,
      paymentMethod
    );

    if (soulNameInstance) {
      result.success = true;
      result.message = "Identity and soulname created!";
      result.tokenId = soulNameInstance.tokenId;
      result.soulName = soulName;
    } else {
        result.message = "Sorry, we were unable to create an identity and soulname for you because of blockchain network congestion. Please try the mint process again or try again in a few minutes. Thank you!";
        console.error(result.message);
    }
  } else {
    console.error(Messages.NotLoggedIn());
  }

  return result;
};
