import { Addresses } from "../../addresses";
import { polygon as polygonAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";

const {
  SoulboundIdentity: SoulboundIdentityAddress,
  SoulStore: SoulStoreAddress,
  SoulboundCreditScore: SoulboundCreditScoreAddress,
  SoulboundGreen: SoulboundGreenAddress,
} = polygonAddresses;

export const polygon: Addresses = {
  SoulboundIdentityAddress,
  SoulStoreAddress,
  SoulboundCreditScoreAddress,
  SoulboundGreenAddress,
};
