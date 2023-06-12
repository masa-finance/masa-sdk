import { bsc as bscAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";

import type { Addresses } from "../../../interface";

const { SoulboundGreen: SoulboundGreenAddress } = bscAddresses;

export const bsc: Addresses = {
  SoulboundGreenAddress,
};
