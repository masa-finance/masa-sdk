// identity
import SoulboundIdentity from "@masa-finance/masa-contracts-identity/deployments/mainnet/SoulboundIdentity.json";
import SoulboundCreditScore from "@masa-finance/masa-contracts-identity/deployments/mainnet/SoulboundCreditScore.json";
import SoulName from "@masa-finance/masa-contracts-identity/deployments/mainnet/SoulName.json";
import SoulStore from "@masa-finance/masa-contracts-identity/deployments/mainnet/SoulStore.json";
import SoulLinker from "@masa-finance/masa-contracts-identity/deployments/mainnet/SoulLinker.json";
import SoulboundGreen from "@masa-finance/masa-contracts-identity/deployments/mainnet/SoulboundGreen.json";
// token
import MasaToken from "@masa-finance/masa-token/deployments/mainnet/MasaToken.json";

export const MASA = MasaToken.address;
export const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
export const WETH = undefined;

export const SoulboundIdentityAddress = SoulboundIdentity.address;
export const SoulboundCreditScoreAddress = SoulboundCreditScore.address;
export const SoulNameAddress = SoulName.address;
export const SoulStoreAddress = SoulStore.address;
export const SoulLinkerAddress = SoulLinker.address;
export const SoulboundGreenAddress = SoulboundGreen.address;
