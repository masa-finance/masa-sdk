import {
  SoulboundCreditScore,
  SoulboundGreen,
  SoulboundIdentity,
  SoulLinker,
  SoulName,
  SoulStore,
} from "@masa-finance/masa-contracts-identity";

export interface IIdentityContracts {
  SoulboundIdentityContract: SoulboundIdentity;
  SoulboundCreditScoreContract: SoulboundCreditScore;
  SoulNameContract: SoulName;
  SoulLinkerContract: SoulLinker;
  SoulStoreContract: SoulStore;
  SoulboundGreenContract: SoulboundGreen;
}
