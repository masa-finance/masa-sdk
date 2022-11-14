import Masa from "../masa";
import { PaymentMethod } from "../contracts";
import { ethers } from "ethers";

export const getRegistrationPrice = async (
  masa: Masa,
  soulName: string,
  duration: number,
  paymentMethod: PaymentMethod
) => {
  let price;
  const prices = await masa.contracts.price(soulName, duration);

  switch (paymentMethod) {
    case "eth":
      price = ethers.utils.formatEther(prices.priceInETH);
      break;
    case "stable":
      price = ethers.utils.formatUnits(prices.priceInStableCoin, 6);
      price = Number.parseFloat(price).toFixed(2).toString();
      break;
    case "utility":
      price = ethers.utils.formatUnits(prices.priceInUtilityToken);
      price = Number.parseFloat(price).toFixed(2).toString();
      break;
    default:
      price = prices.priceInETH;
  }

  console.log(`Soulname price is ${price} ${paymentMethod}.`);

  return price;
};

const purchaseSoulName = async (
  masa: Masa,
  soulName: string,
  duration: number,
  paymentMethod: PaymentMethod
) => {
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

    await purchaseSoulName(masa, soulName, duration, paymentMethod);
  } else {
    console.log("Not logged in please login first");
  }
};
