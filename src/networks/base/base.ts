import { base as baseAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";

import type { Addresses } from "../../interface";

const {
  SoulboundIdentity: SoulboundIdentityAddress,
  SoulName: SoulNameAddress,
  SoulStore: SoulStoreAddress,
  SoulboundGreen: SoulboundGreenAddress,
} = baseAddresses;

export const base: Addresses = {
  SoulboundIdentityAddress,
  SoulNameAddress,
  SoulStoreAddress,
  SoulboundGreenAddress,
};
