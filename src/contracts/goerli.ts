import SoulboundIdentity from '@masa-finance/masa-contracts-identity/deployments/goerli/SoulboundIdentity.json';
import SoulboundCreditReport from '@masa-finance/masa-contracts-identity/deployments/goerli/SoulboundCreditReport.json';
import SoulName from '@masa-finance/masa-contracts-identity/deployments/goerli/SoulName.json';
import SoulStore from '@masa-finance/masa-contracts-identity/deployments/goerli/SoulStore.json';
import SoulLinker from '@masa-finance/masa-contracts-identity/deployments/goerli/SoulLinker.json';

export {
  MASA_GOERLI as MASA,
  USDC_GOERLI as USDC,
  WETH_GOERLI as WETH,
} from '@masa-finance/masa-contracts-identity/dist/src/constants';

export const SoulboundIdentityAddress = SoulboundIdentity.address;
export const SoulboundCreditReportAddress = SoulboundCreditReport.address;
export const SoulNameAddress = SoulName.address;
export const SoulStoreAddress = SoulStore.address;
export const SoulLinkerAddress = SoulLinker.address;
