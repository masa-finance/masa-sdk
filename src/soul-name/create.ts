import Masa from "../masa";
import { PaymentMethod } from "../contracts";
import { CreateSoulNameResult } from "../interface";

export const getRegistrationPrice = async (
  masa: Masa,
  soulName: string,
  duration: number,
  paymentMethod: PaymentMethod
) => {
  const { price, formattedPrice } = await masa.contracts.getPaymentInformation(
    soulName,
    paymentMethod,
    duration,
    masa.config.wallet
  );

  console.log("adsasd", formattedPrice);

  console.log(`Soulname price is ${price} ${paymentMethod}.`);

  return price;
};

const purchaseSoulName = async (
  masa: Masa,
  soulName: string,
  duration: number,
  paymentMethod: PaymentMethod
): Promise<{ tokenId: string; soulName: string } | undefined> => {
  if (await masa.contracts.isAvailable(soulName)) {
    console.log("Writing metadata");
    const storeMetadataData = await masa.metadata.store(soulName);

    if (storeMetadataData) {
      const metadataUrl = `ar://${storeMetadataData.metadataTransaction.id}`;
      console.log(`Matadata URL: ${metadataUrl}`);

      const tx = await masa.contracts.purchaseName(
        masa.config.wallet,
        soulName,
        paymentMethod,
        duration,
        metadataUrl
      );

      console.log("Waiting for transaction to finalize");
      const result = await tx.wait();

      const purchasedEvent = result.events?.find(
        (e: any) => e.event === "SoulNamePurchased"
      );

      let tokenId;
      if (purchasedEvent && purchasedEvent.decode) {
        const decodedEvent = purchasedEvent.decode(purchasedEvent.data);
        tokenId = decodedEvent.tokenId.toNumber();
        console.log(`Token with ID: ${tokenId} created.`);
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
  soulName: string,
  duration: number,
  paymentMethod: PaymentMethod
): Promise<CreateSoulNameResult> => {
  const result: CreateSoulNameResult = {
    success: false,
    message: "Unknown Error",
  };

  if (await masa.session.checkLogin()) {
    if (soulName.endsWith(".soul")) {
      soulName = soulName.replace(".soul", "");
    }

    const address = await masa.config.wallet.getAddress();

    const identityId = await masa.identity.load(address);
    if (!identityId) return result;

    const aa = await purchaseSoulName(masa, soulName, duration, paymentMethod);

    if (aa) {
      result.success = true;
      result.message = "Soulname created!";
      result.tokenId = aa.tokenId;
      result.soulName = soulName;
    }
  } else {
    result.message = "Not logged in please login first";
    console.log(result.message);
  }

  return result;
};
