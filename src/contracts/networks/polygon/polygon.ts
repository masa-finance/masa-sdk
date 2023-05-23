import { Addresses } from "../../addresses";
import { polygon as polygonAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";

const {
  SoulboundIdentity: SoulboundIdentityAddress,
  SoulboundCreditScore: SoulboundCreditScoreAddress,
  SoulboundGreen: SoulboundGreenAddress,
} = polygonAddresses;

export const polygon: Addresses = {
  SoulboundIdentityAddress,
  SoulboundCreditScoreAddress,
  SoulboundGreenAddress,
};
