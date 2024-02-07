import { bsctest as bsctestAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";
import { bsctest as bsctestAddressesMasaToken } from "@masa-finance/masa-token/addresses.json";

import type { Addresses } from "../../interface";

const { SoulboundGreen: SoulboundGreenAddress } = bsctestAddresses;

export const bsctest: Addresses = {
  SoulboundGreenAddress,
  tokens: {
    MASA: bsctestAddressesMasaToken.MasaTokenOFT,
  },
};
