import { address as SoulboundIdentityAddress } from "@masa-finance/masa-contracts-identity/deployments/celo/SoulboundIdentity.json";
import { address as SoulNameAddress } from "@masa-finance/masa-contracts-identity/deployments/celo/SoulName.json";
import { address as SoulStoreAddress } from "@masa-finance/masa-contracts-identity/deployments/celo/SoulStore.json";
import { address as SoulboundGreenAddress } from "@masa-finance/masa-contracts-identity/deployments/celo/SoulboundGreen.json";
import { Addresses } from "../../addresses";

export const celo: Addresses = {
  tokens: {
    G$: "0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A",
    cUSD: "0x765de816845861e75a25fca122bb6898b8b1282a",
  },
  SoulboundIdentityAddress,
  SoulNameAddress,
  SoulStoreAddress,
  SoulboundGreenAddress,
};
