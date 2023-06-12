// identity
import { mainnet as ethereumAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";
// token
import { address as MASA } from "@masa-finance/masa-token/deployments/mainnet/MasaToken.json";

import { Addresses } from "../../addresses";

const {
  SoulboundIdentity: SoulboundIdentityAddress,
  SoulboundCreditScore: SoulboundCreditScoreAddress,
  SoulName: SoulNameAddress,
  SoulStore: SoulStoreAddress,
  SoulLinker: SoulLinkerAddress,
  SoulboundGreen: SoulboundGreenAddress,
} = ethereumAddresses;

export const ethereum: Addresses = {
  tokens: {
    MASA,
    USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  },
  SoulboundIdentityAddress,
  SoulboundCreditScoreAddress,
  SoulNameAddress,
  SoulStoreAddress,
  SoulLinkerAddress,
  SoulboundGreenAddress,
};
