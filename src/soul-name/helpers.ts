import GraphemeSplitter from "grapheme-splitter";
import Masa from "../masa";
import { PaymentMethod, SoulNameDetails } from "../interface";

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

export const printSoulName = (soulName: SoulNameDetails, index?: number) => {
  console.log("\n");

  if (index) {
    console.log(`Token: ${index + 1}`);
  }

  console.log(`Token ID: '${soulName.tokenDetails.tokenId.toNumber()}'`);
  console.log(`Name: '${soulName.tokenDetails.sbtName}'`);
  console.log(`Extension: '${soulName.tokenDetails.extension}'`);
  console.log(`Owner Address: '${soulName.owner}'`);
  console.log(
    `Owner Identity ID: '${soulName.tokenDetails.identityId.toNumber()}'`
  );
  console.log(`Active: ${soulName.tokenDetails.active}`);
  console.log(`Metadata URL: '${soulName.tokenUri}'`);

  if (soulName.metadata) {
    console.log(`Metadata: ${JSON.stringify(soulName.metadata, null, 2)}`);
  }

  console.log(
    `Expiry Date: ${new Date(
      soulName.tokenDetails.expirationDate.toNumber() * 1000
    ).toUTCString()}`
  );
};

export const calculateSoulNameLength = (soulName: string) => {
  return new GraphemeSplitter().countGraphemes(soulName);
};

export const getSoulNameMetadataPrefix = (masa: Masa): string => {
  // special handling for celo networks
  return masa.config.networkName === "celo" ||
    masa.config.networkName === "alfajores"
    ? "https://arweave.net/"
    : "ar://";
};
