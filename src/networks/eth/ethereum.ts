// identity
import { mainnet as ethereumAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";
// token
import { ethereum as ethereumAddressesMasaToken } from "@masa-finance/masa-token/addresses.json";

import type { Addresses } from "../../interface";

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
    MASA: ethereumAddressesMasaToken.MasaToken,
    USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  },
  SoulboundIdentityAddress,
  SoulboundCreditScoreAddress,
  SoulNameAddress,
  SoulStoreAddress,
  SoulLinkerAddress,
  SoulboundGreenAddress,
};
