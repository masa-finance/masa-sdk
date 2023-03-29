// identity
import { Addresses } from "../../addresses";

import { address as SoulboundIdentityAddress } from "@masa-finance/masa-contracts-identity/deployments/goerli/SoulboundIdentity.json";
import { address as SoulboundCreditScoreAddress } from "@masa-finance/masa-contracts-identity/deployments/goerli/SoulboundCreditScore.json";
import { address as SoulNameAddress } from "@masa-finance/masa-contracts-identity/deployments/goerli/SoulName.json";
import { address as SoulStoreAddress } from "@masa-finance/masa-contracts-identity/deployments/goerli/SoulStore.json";
import { address as SoulLinkerAddress } from "@masa-finance/masa-contracts-identity/deployments/goerli/SoulLinker.json";
import { address as SoulboundGreenAddress } from "@masa-finance/masa-contracts-identity/deployments/goerli/SoulboundGreen.json";
// token
import { address as MASA } from "@masa-finance/masa-token/deployments/goerli/MasaToken.json";

export const goerli: Addresses = {
  tokens: {
    MASA,
    USDC: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
  },
  SoulboundIdentityAddress,
  SoulNameAddress,
  SoulStoreAddress,
  SoulboundCreditScoreAddress,
  SoulLinkerAddress,
  SoulboundGreenAddress,
};
