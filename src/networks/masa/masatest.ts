import { masatest as masatestAddresses } from "@masa-finance/masa-contracts-marketplace/addresses.json";

import type { Addresses } from "../../interface";

const { DataPointsMulti: DataPointsMultiAddress, DataStaking: DataStakingAddress } = masatestAddresses;

export const masatest: Addresses = {
  DataPointsMultiAddress,
  DataStakingAddress
};
