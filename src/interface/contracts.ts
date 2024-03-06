import type {
  SoulboundCreditScore,
  SoulboundGreen,
  SoulboundIdentity,
  SoulLinker,
  SoulName,
  SoulStore,
} from "@masa-finance/masa-contracts-identity";
import type { DataStakingDynamic } from "@masa-finance/masa-contracts-marketplace";

export interface ContractInfo {
  hasAddress?: boolean;
}

export interface IMarketplaceContracts {
  DataStakingDynamic: DataStakingDynamic & ContractInfo;
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
