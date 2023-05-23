import { Addresses } from "../../addresses";
import { mumbai as mumbaiAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";

const {
  SoulboundIdentity: SoulboundIdentityAddress,
  SoulboundCreditScore: SoulboundCreditScoreAddress,
  SoulStore: SoulStoreAddress,
  SoulLinker: SoulLinkerAddress,
  SoulboundGreen: SoulboundGreenAddress,
} = mumbaiAddresses;

export const mumbai: Addresses = {
  SoulboundIdentityAddress,
  SoulboundCreditScoreAddress,
  SoulStoreAddress,
  SoulLinkerAddress,
  SoulboundGreenAddress,
};
