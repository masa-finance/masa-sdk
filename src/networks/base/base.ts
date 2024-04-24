import { base as baseAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";
import { base as BaseAddressesMasaToken } from "@masa-finance/masa-token/addresses.json";

import type { Addresses } from "../../interface";

const {
  SoulboundIdentity: SoulboundIdentityAddress,
  SoulName: SoulNameAddress,
  SoulStore: SoulStoreAddress,
  SoulboundGreen: SoulboundGreenAddress,
} = baseAddresses;

export const base: Addresses = {
  tokens: {
    MASA: BaseAddressesMasaToken.MasaTokenOFT,
  },
  SoulboundIdentityAddress,
  SoulNameAddress,
  SoulStoreAddress,
  SoulboundGreenAddress,
};
