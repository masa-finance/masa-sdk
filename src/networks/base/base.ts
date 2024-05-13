import { base as baseAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";
import { base as basesAddressesMasaStaking } from "@masa-finance/masa-contracts-staking/addresses.json";
import { base as BaseAddressesMasaToken } from "@masa-finance/masa-token/addresses.json";

import type { Addresses } from "../../interface";

const { MasaStaking: MasaStakingAddress } = basesAddressesMasaStaking;

const {
  SoulboundIdentity: SoulboundIdentityAddress,
  SoulName: SoulNameAddress,
  SoulStore: SoulStoreAddress,
  SoulboundGreen: SoulboundGreenAddress,
} = baseAddresses;

export const base: Addresses = {
  tokens: {
    MASA: BaseAddressesMasaToken.MasaTokenOFT,
  },
  SoulboundIdentityAddress,
  SoulNameAddress,
  SoulStoreAddress,
  SoulboundGreenAddress,
  MasaStakingAddress,
};
