import { Addresses } from "../../addresses";
import { basegoerli as basegoerliAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";

const {
  SoulboundIdentity: SoulboundIdentityAddress,
  SoulName: SoulNameAddress,
  SoulStore: SoulStoreAddress,
  SoulboundGreen: SoulboundGreenAddress,
} = basegoerliAddresses;

export const basegoerli: Addresses = {
  SoulboundIdentityAddress,
  SoulNameAddress,
  SoulStoreAddress,
  SoulboundGreenAddress,
};
