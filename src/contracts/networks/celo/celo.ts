import { celo as celoAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";

import type { Addresses } from "../../../interface";

const {
  SoulboundIdentity: SoulboundIdentityAddress,
  SoulName: SoulNameAddress,
  SoulStore: SoulStoreAddress,
  SoulboundGreen: SoulboundGreenAddress,
} = celoAddresses;

export const celo: Addresses = {
  tokens: {
    G$: "0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A",
    cUSD: "0x765de816845861e75a25fca122bb6898b8b1282a",
  },
  SoulboundIdentityAddress,
  SoulNameAddress,
  SoulStoreAddress,
  SoulboundGreenAddress,
};
