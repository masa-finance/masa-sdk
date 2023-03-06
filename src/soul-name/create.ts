import Masa from "../masa";
import { PaymentMethod } from "../contracts";
import { CreateSoulNameResult } from "../interface";
import { Messages } from "../utils";
import { Event } from "ethers";

export const getRegistrationPrice = async (
  masa: Masa,
  paymentMethod: PaymentMethod,
  soulName: string,
  duration: number
) => {
  const { length } = masa.soulName.validate(soulName);

  const { price, formattedPrice } = await masa.contracts.soulName.getPrice(
    paymentMethod,
    length,
    duration
  );

  console.log(`Soulname price is ${formattedPrice} ${paymentMethod}.`);

  return price;
};

const purchaseSoulName = async (
  masa: Masa,
  paymentMethod: PaymentMethod,
  soulName: string,
  soulNameLength: number,
  duration: number,
  receiver?: string
): Promise<{ tokenId: string; soulName: string } | undefined> => {
  if (await masa.contracts.soulName.isAvailable(soulName)) {
    const extension =
      await masa.contracts.instances.SoulNameContract.extension();

    receiver = receiver || (await masa.config.wallet.getAddress());

    const storeMetadataData = await masa.client.soulName.store(
      `${soulName}${extension}`,
      receiver,
      duration,
      masa.config.network
    );

    if (storeMetadataData) {
      const soulNameMetadataUrl = `${masa.soulName.getSoulNameMetadataPrefix()}${
        storeMetadataData.metadataTransaction.id
      }`;
      console.log(`Soul Name Metadata URL: '${soulNameMetadataUrl}'`);

      const tx = await masa.contracts.soulName.purchase(
        paymentMethod,
        soulName,
        soulNameLength,
        duration,
        soulNameMetadataUrl,
        storeMetadataData.authorityAddress,
        storeMetadataData.signature,
        receiver
      );

      console.log(Messages.WaitingToFinalize(tx.hash));
      const result = await tx.wait();

      const purchasedEvent = result.events?.find(
        (event: Event) => event.event === "SoulNamePurchased"
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

export const createSoulName = async (
  masa: Masa,
  paymentMethod: PaymentMethod,
  soulName: string,
  duration: number,
  receiver?: string
): Promise<CreateSoulNameResult> => {
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

    const { identityId } = await masa.identity.load();
    if (!identityId) return result;

    const soulNameInstance = await purchaseSoulName(
      masa,
      paymentMethod,
      soulName,
      length,
      duration,
      receiver
    );

    if (soulNameInstance) {
      result.success = true;
      result.message = "Soulname created!";
      result.tokenId = soulNameInstance.tokenId;
      result.soulName = soulName;
    }
  } else {
    result.message = Messages.NotLoggedIn();
    console.error(result.message);
  }

  return result;
};
