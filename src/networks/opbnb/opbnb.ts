import { opbnb as opbnbAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";

import type { Addresses } from "../../interface";

const { SoulboundIdentity: SoulboundIdentityAddress } = opbnbAddresses;

export const opbnb: Addresses = {
  SoulboundIdentityAddress,
};
