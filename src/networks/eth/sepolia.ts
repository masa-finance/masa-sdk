// token
import { sepolia as sepoliaAddressesMasaStaking } from "@masa-finance/masa-contracts-staking/addresses.json";
import { sepolia as sepoliaAddressesMasaToken } from "@masa-finance/masa-token/addresses.json";

import type { Addresses } from "../../interface";

const { MasaStaking: MasaStakingAddress } = sepoliaAddressesMasaStaking;

export const sepolia: Addresses = {
  tokens: {
    MASA: sepoliaAddressesMasaToken.MasaToken,
  },
  MasaStakingAddress,
};
