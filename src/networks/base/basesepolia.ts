import { basesepolia as basesepoliaAddressesMasaStaking } from "@masa-finance/masa-contracts-staking/addresses.json";
import { basesepolia as BaseSepoliaAddressesMasaToken } from "@masa-finance/masa-token/addresses.json";

import type { Addresses } from "../../interface";

const { MasaStaking: MasaStakingAddress } = basesepoliaAddressesMasaStaking;

export const basesepolia: Addresses = {
  tokens: {
    MASA: BaseSepoliaAddressesMasaToken.MasaTokenOFT,
  },
  MasaStakingAddress,
};
