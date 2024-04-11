import { masa as masaAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";

import type { Addresses } from "../../interface";

const { SoulboundIdentity: SoulboundIdentityAddress } = masaAddresses;

export const masa: Addresses = {
  SoulboundIdentityAddress,
};
