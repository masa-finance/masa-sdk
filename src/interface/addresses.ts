import type { Tokens } from "./tokens";

export interface Addresses {
  tokens?: Tokens;
  // Identity
  SoulboundIdentityAddress?: string;
  SoulboundCreditScoreAddress?: string;
  SoulNameAddress?: string;
  SoulStoreAddress?: string;
  SoulLinkerAddress?: string;
  SoulboundGreenAddress?: string;
  // marketplace
  DataStakingAddress?: string;
  DataPointsMultiAddress?: string;
}
