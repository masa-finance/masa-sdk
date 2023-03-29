// identity
import { address as SoulboundIdentityAddress } from "@masa-finance/masa-contracts-identity/deployments/mainnet/SoulboundIdentity.json";
import { address as SoulboundCreditScoreAddress } from "@masa-finance/masa-contracts-identity/deployments/mainnet/SoulboundCreditScore.json";
import { address as SoulNameAddress } from "@masa-finance/masa-contracts-identity/deployments/mainnet/SoulName.json";
import { address as SoulStoreAddress } from "@masa-finance/masa-contracts-identity/deployments/mainnet/SoulStore.json";
import { address as SoulLinkerAddress } from "@masa-finance/masa-contracts-identity/deployments/mainnet/SoulLinker.json";
import { address as SoulboundGreenAddress } from "@masa-finance/masa-contracts-identity/deployments/mainnet/SoulboundGreen.json";
// token
import { address as MASA } from "@masa-finance/masa-token/deployments/mainnet/MasaToken.json";
import { Addresses } from "../../addresses";

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
