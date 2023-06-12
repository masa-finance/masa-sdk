import { alfajores as alfajoresAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";

import { Addresses } from "../../../interface/addresses";

const {
  SoulboundIdentity: SoulboundIdentityAddress,
  SoulName: SoulNameAddress,
  SoulStore: SoulStoreAddress,
  SoulboundGreen: SoulboundGreenAddress,
} = alfajoresAddresses;

export const alfajores: Addresses = {
  tokens: {
    cUSD: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
  },
  SoulboundIdentityAddress,
  SoulNameAddress,
  SoulStoreAddress,
  SoulboundGreenAddress,
};
