import { masatest as masatestAddresses } from "@masa-finance/masa-contracts-marketplace/addresses.json";
import { masatest as masatestAddressesMasaToken } from "@masa-finance/masa-token/addresses.json";

import type { Addresses } from "../../interface";

const {
  DataPointsMulti: DataPointsMultiAddress,
  DataStakingDynamicNative: DataStakingDynamicNativeAddress,
} = masatestAddresses;

export const masatest: Addresses = {
  tokens: {
    MASA: masatestAddressesMasaToken.MasaTokenNativeOFT,
  },
  DataPointsMultiAddress,
  DataStakingDynamicNativeAddress,
};
