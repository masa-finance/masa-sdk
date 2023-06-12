import type {
  SoulboundCreditScore,
  SoulboundGreen,
  SoulboundIdentity,
  SoulLinker,
  SoulName,
  SoulStore,
} from "@masa-finance/masa-contracts-identity";

export interface ContractInfo {
  hasAddress?: boolean;
}

export interface IIdentityContracts {
  SoulboundIdentityContract: SoulboundIdentity & ContractInfo;
  SoulboundCreditScoreContract: SoulboundCreditScore & ContractInfo;
  SoulNameContract: SoulName & ContractInfo;
  SoulLinkerContract: SoulLinker & ContractInfo;
  SoulStoreContract: SoulStore & ContractInfo;
  SoulboundGreenContract: SoulboundGreen & ContractInfo;
}
