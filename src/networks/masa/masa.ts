import { masa as masaAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";
import { masa as masaAddressesMarketplace } from "@masa-finance/masa-contracts-marketplace/addresses.json";
import { masa as masaAddressesMasaToken } from "@masa-finance/masa-token/addresses.json";

import type { Addresses } from "../../interface";

const { DataPointsMulti: DataPointsMultiAddress } = masaAddressesMarketplace;

const { SoulboundIdentity: SoulboundIdentityAddress } = masaAddresses;

export const masa: Addresses = {
  tokens: {
    MASA: masaAddressesMasaToken.MasaTokenNativeOFT,
  },
  SoulboundIdentityAddress,
  DataPointsMultiAddress,
};
