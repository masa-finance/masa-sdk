import { Addresses } from "../../addresses";
// identity
import { goerli as goerliAddresses } from "@masa-finance/masa-contracts-identity/addresses.json";
// token
import { address as MASA } from "@masa-finance/masa-token/deployments/goerli/MasaToken.json";

const {
  SoulboundIdentity: SoulboundIdentityAddress,
  SoulName: SoulNameAddress,
  SoulStore: SoulStoreAddress,
  SoulboundCreditScore: SoulboundCreditScoreAddress,
  SoulLinker: SoulLinkerAddress,
  SoulboundGreen: SoulboundGreenAddress,
} = goerliAddresses;

export const goerli: Addresses = {
  tokens: {
    MASA,
    USDC: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
  },
  SoulboundIdentityAddress,
  SoulNameAddress,
  SoulStoreAddress,
  SoulboundCreditScoreAddress,
  SoulLinkerAddress,
  SoulboundGreenAddress,
};
