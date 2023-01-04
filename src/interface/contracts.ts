import {
  Soulbound2FA,
  SoulboundCreditScore,
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
  Soulbound2FAContract: Soulbound2FA;
}
