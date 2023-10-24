import { scroll as scrollAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";

import type { Addresses } from "../../interface";

const { SoulboundIdentity: SoulboundIdentityAddress } = scrollAddresses;

export const scroll: Addresses = {
  SoulboundIdentityAddress,
};
