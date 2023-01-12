import Masa from "../masa";
import { PaymentMethod } from "../contracts";
import { CreateSoulNameResult } from "../interface";

export const getRegistrationPrice = async (
  masa: Masa,
  soulName: string,
  duration: number,
  paymentMethod: PaymentMethod
) => {
  const { length } = masa.soulName.validate(soulName);

  const { price, formattedPrice } = await masa.contracts.getPaymentInformation(
    masa.config.wallet,
    paymentMethod,
    length,
    duration
  );

  console.log(`Soulname price is ${formattedPrice} ${paymentMethod}.`);

  return price;
};

const purchaseSoulName = async (
  masa: Masa,
  soulName: string,
  soulNameLength: number,
  duration: number,
  paymentMethod: PaymentMethod
): Promise<{ tokenId: string; soulName: string } | undefined> => {
  if (await masa.contracts.isAvailable(soulName)) {
    const storeMetadataData = await masa.metadata.store(
      soulName,
      await masa.config.wallet.getAddress(),
      duration
    );

    if (storeMetadataData) {
      const metadataUrl = `ar://${storeMetadataData.metadataTransaction.id}`;
      console.log(`Soul Name Metadata URL: '${metadataUrl}'`);

      const tx = await masa.contracts.purchaseName(
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
      soulName,
      length,
      duration,
      paymentMethod
    );

    if (soulNameInstance) {
      result.success = true;
      result.message = "Soulname created!";
      result.tokenId = soulNameInstance.tokenId;
      result.soulName = soulName;
    }
  } else {
    result.message = "Not logged in please login first";
    console.log(result.message);
  }

  return result;
};
