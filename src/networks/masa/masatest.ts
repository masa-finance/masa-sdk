import { masatest as masatestAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";
import { masatest as masatestAddressesMarketplace } from "@masa-finance/masa-contracts-marketplace/addresses.json";
import { masatest as masatestAddressesMasaToken } from "@masa-finance/masa-token/addresses.json";

import type { Addresses } from "../../interface";

const { DataPointsMulti: DataPointsMultiAddress } =
  masatestAddressesMarketplace;

const { SoulboundIdentity: SoulboundIdentityAddress } = masatestAddresses;

export const masatest: Addresses = {
  tokens: {
    MASA: masatestAddressesMasaToken.MasaTokenNativeOFT,
  },
  SoulboundIdentityAddress,
  DataPointsMultiAddress,
};
