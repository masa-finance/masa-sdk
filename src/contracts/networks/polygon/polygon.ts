import { polygon as polygonAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";

import { Addresses } from "../../../interface";

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
