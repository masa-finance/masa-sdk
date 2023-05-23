import { Addresses } from "../../addresses";
import { bsc as bscAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";

const { SoulboundGreen: SoulboundGreenAddress } = bscAddresses;

export const bsc: Addresses = {
  SoulboundGreenAddress,
};
