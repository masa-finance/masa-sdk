import type {
  SoulboundCreditScore,
  SoulboundGreen,
  SoulboundIdentity,
  SoulLinker,
  SoulName,
  SoulStore,
} from "@masa-finance/masa-contracts-identity";
import type {
  DataPointsMulti,
  ProxyViewAggregator,
} from "@masa-finance/masa-contracts-marketplace";
import { MasaStaking } from "@masa-finance/masa-contracts-staking";
import { MasaToken } from "@masa-finance/masa-token";

export interface ContractInfo {
  hasAddress?: boolean;
}

export interface IMarketplaceContracts {
  DataPointsMulti: DataPointsMulti & ContractInfo;
  ProxyViewAggregator: ProxyViewAggregator & ContractInfo;
}

export interface ITokenContracts {
  MasaToken: MasaToken & ContractInfo;
  MasaStaking: MasaStaking & ContractInfo;
}

export interface IIdentityContracts {
  SoulboundIdentityContract: SoulboundIdentity & ContractInfo;
  SoulboundCreditScoreContract: SoulboundCreditScore & ContractInfo;
  SoulNameContract: SoulName & ContractInfo;
  SoulLinkerContract: SoulLinker & ContractInfo;
  SoulStoreContract: SoulStore & ContractInfo;
  SoulboundGreenContract: SoulboundGreen & ContractInfo;
}

export interface DeployResult<Tuple> {
  address: string;
  constructorArguments: (string | number | Tuple)[];
  abiEncodedConstructorArguments: string;
}
