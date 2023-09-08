import { opbnbtest as opbnbtestAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";

import type { Addresses } from "../../interface";

const { SoulboundIdentity: SoulboundIdentityAddress } = opbnbtestAddresses;

export const opbnbtest: Addresses = {
  SoulboundIdentityAddress,
};
