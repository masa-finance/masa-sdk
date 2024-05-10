import { bsc as bscAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";
import { bsc as bscAddressesMasaStaking } from "@masa-finance/masa-contracts-staking/addresses.json";
import { bsc as bscAddressesMasaToken } from "@masa-finance/masa-token/addresses.json";

import type { Addresses } from "../../interface";


const { MasaStaking: MasaStakingAddress } = bscAddressesMasaStaking;

const { SoulboundGreen: SoulboundGreenAddress } = bscAddresses;

export const bsc: Addresses = {
  tokens: {
    MASA: bscAddressesMasaToken.MasaTokenOFT,
  },
  SoulboundGreenAddress,
  MasaStakingAddress
};
