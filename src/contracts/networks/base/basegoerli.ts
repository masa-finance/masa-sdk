import { basegoerli as basegoerliAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";

import { Addresses } from "../../../interface/addresses";

const {
  SoulboundIdentity: SoulboundIdentityAddress,
  SoulName: SoulNameAddress,
  SoulStore: SoulStoreAddress,
  SoulboundGreen: SoulboundGreenAddress,
} = basegoerliAddresses;

export const basegoerli: Addresses = {
  SoulboundIdentityAddress,
  SoulNameAddress,
  SoulStoreAddress,
  SoulboundGreenAddress,
};
