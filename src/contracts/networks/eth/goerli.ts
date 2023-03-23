import { Tokens } from "../../addresses";

// identity
import SoulboundIdentity from "@masa-finance/masa-contracts-identity/deployments/goerli/SoulboundIdentity.json";
import SoulboundCreditScore from "@masa-finance/masa-contracts-identity/deployments/goerli/SoulboundCreditScore.json";
import SoulName from "@masa-finance/masa-contracts-identity/deployments/goerli/SoulName.json";
import SoulStore from "@masa-finance/masa-contracts-identity/deployments/goerli/SoulStore.json";
import SoulLinker from "@masa-finance/masa-contracts-identity/deployments/goerli/SoulLinker.json";
import SoulboundGreen from "@masa-finance/masa-contracts-identity/deployments/goerli/SoulboundGreen.json";
// token
import MasaToken from "@masa-finance/masa-token/deployments/goerli/MasaToken.json";

export const tokens: Tokens = {
  MASA: MasaToken.address,
  USDC: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
};

export const SoulboundIdentityAddress = SoulboundIdentity.address;
export const SoulboundCreditScoreAddress = SoulboundCreditScore.address;
export const SoulNameAddress = SoulName.address;
export const SoulStoreAddress = SoulStore.address;
export const SoulLinkerAddress = SoulLinker.address;
export const SoulboundGreenAddress = SoulboundGreen.address;
