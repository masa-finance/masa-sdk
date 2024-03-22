import { masatest as masatestAddresses } from "@masa-finance/masa-contracts-marketplace/addresses.json";
import { masatest as masatestAddressesMasaToken } from "@masa-finance/masa-token/addresses.json";

import type { Addresses } from "../../interface";

// Assuming masatestAddresses.DataStakingDynamicNative is an array of addresses
const {
  DataPointsMulti: DataPointsMultiAddress,
  DataStakingDynamicNative: DataStakingDynamicNativeAddresses,
} = masatestAddresses;

export const masatest: Addresses = {
  tokens: {
    MASA: masatestAddressesMasaToken.MasaTokenNativeOFT,
  },
  DataPointsMultiAddress,
  DataStakingDynamicNativeAddress: DataStakingDynamicNativeAddresses, // Assign the array here
};
