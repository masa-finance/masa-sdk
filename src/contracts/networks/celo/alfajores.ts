import { address as SoulboundIdentityAddress } from "@masa-finance/masa-contracts-identity/deployments/alfajores/SoulboundIdentity.json";
import { address as SoulNameAddress } from "@masa-finance/masa-contracts-identity/deployments/alfajores/SoulName.json";
import { address as SoulStoreAddress } from "@masa-finance/masa-contracts-identity/deployments/alfajores/SoulStore.json";
import { address as SoulboundGreenAddress } from "@masa-finance/masa-contracts-identity/deployments/alfajores/SoulboundGreen.json";
import { Addresses } from "../../addresses";

export const alfajores: Addresses = {
  tokens: {
    cUSD: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
  },
  SoulboundIdentityAddress,
  SoulNameAddress,
  SoulStoreAddress,
  SoulboundGreenAddress,
};
