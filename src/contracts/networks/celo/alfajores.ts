import { Tokens } from "../../addresses";

import SoulboundIdentity from "@masa-finance/masa-contracts-identity/deployments/alfajores/SoulboundIdentity.json";
import SoulName from "@masa-finance/masa-contracts-identity/deployments/alfajores/SoulName.json";
import SoulStore from "@masa-finance/masa-contracts-identity/deployments/alfajores/SoulStore.json";
import SoulboundGreen from "@masa-finance/masa-contracts-identity/deployments/alfajores/SoulboundGreen.json";

export const tokens: Tokens = {
  cUSD: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
};

export const SoulboundIdentityAddress = SoulboundIdentity.address;
export const SoulNameAddress = SoulName.address;
export const SoulStoreAddress = SoulStore.address;
export const SoulboundGreenAddress = SoulboundGreen.address;
