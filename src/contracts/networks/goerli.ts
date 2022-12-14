import SoulboundIdentity from "@masa-finance/masa-contracts-identity/deployments/goerli/SoulboundIdentity.json";
import SoulboundCreditScore from "@masa-finance/masa-contracts-identity/deployments/goerli/SoulboundCreditScore.json";
import SoulName from "@masa-finance/masa-contracts-identity/deployments/goerli/SoulName.json";
import SoulStore from "@masa-finance/masa-contracts-identity/deployments/goerli/SoulStore.json";
import SoulLinker from "@masa-finance/masa-contracts-identity/deployments/goerli/SoulLinker.json";
import Soulbound2FA from "@masa-finance/masa-contracts-identity/deployments/goerli/Soulbound2FA.json";

export {
  MASA_GOERLI as MASA,
  USDC_GOERLI as USDC,
  WETH_GOERLI as WETH,
} from "@masa-finance/masa-contracts-identity/dist/src/Constants";

export const SoulboundIdentityAddress = SoulboundIdentity.address;
export const SoulboundCreditScoreAddress = SoulboundCreditScore.address;
export const SoulNameAddress = SoulName.address;
export const SoulStoreAddress = SoulStore.address;
export const SoulLinkerAddress = SoulLinker.address;
export const Soulbound2FAAddress = Soulbound2FA.address;
