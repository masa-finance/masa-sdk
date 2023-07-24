// identity
import { goerli as goerliAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";
// token
import { address as MASA } from "@masa-finance/masa-token/deployments/goerli/MasaToken.json";

import type { Addresses } from "../../interface";

const {
  SoulboundIdentity: SoulboundIdentityAddress,
  SoulName: SoulNameAddress,
  SoulStore: SoulStoreAddress,
  SoulboundCreditScore: SoulboundCreditScoreAddress,
  SoulLinker: SoulLinkerAddress,
  SoulboundGreen: SoulboundGreenAddress,
} = goerliAddresses;

export const goerli: Addresses = {
  tokens: {
    MASA,
    USDC: "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C",
  },
  SoulboundIdentityAddress,
  SoulNameAddress,
  SoulStoreAddress,
  SoulboundCreditScoreAddress,
  SoulLinkerAddress,
  SoulboundGreenAddress,
};
