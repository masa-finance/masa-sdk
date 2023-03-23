import { Tokens } from "../../addresses";

import SoulboundIdentity from "@masa-finance/masa-contracts-identity/deployments/celo/SoulboundIdentity.json";
import SoulName from "@masa-finance/masa-contracts-identity/deployments/celo/SoulName.json";
import SoulStore from "@masa-finance/masa-contracts-identity/deployments/celo/SoulStore.json";
import SoulboundGreen from "@masa-finance/masa-contracts-identity/deployments/celo/SoulboundGreen.json";

export const tokens: Tokens = {
  G$: "0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A",
  cUSD: "0x765de816845861e75a25fca122bb6898b8b1282a",
};

export const SoulboundIdentityAddress = SoulboundIdentity.address;
export const SoulNameAddress = SoulName.address;
export const SoulStoreAddress = SoulStore.address;
export const SoulboundGreenAddress = SoulboundGreen.address;
