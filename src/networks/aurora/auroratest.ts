import { auroratest as auroratestAddressesMasaStaking } from "@masa-finance/masa-contracts-staking/addresses.json";
import { auroratest as auroratestAddressesMasaToken } from "@masa-finance/masa-token/addresses.json";

import type { Addresses } from "../../interface";

const { MasaStaking: MasaStakingAddress } = auroratestAddressesMasaStaking;

export const auroratest: Addresses = {
  tokens: {
    MASA: auroratestAddressesMasaToken.MasaTokenOFT,
  },
  MasaStakingAddress,
};
