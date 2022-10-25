import {
  SoulboundCreditReport,
  SoulboundIdentity,
  SoulLinker,
  SoulName,
  SoulStore,
} from "@masa-finance/masa-contracts-identity";

export interface IIdentityContracts {
  SoulboundIdentityContract: SoulboundIdentity;
  SoulboundCreditReportContract: SoulboundCreditReport;
  SoulNameContract: SoulName;
  SoulLinkerContract: SoulLinker;
  SoulStoreContract: SoulStore;
}
