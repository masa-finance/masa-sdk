import type { Tokens } from "./tokens";

export interface Addresses {
  tokens?: Tokens;
  SoulboundIdentityAddress?: string;
  SoulboundCreditScoreAddress?: string;
  SoulNameAddress?: string;
  SoulStoreAddress?: string;
  SoulLinkerAddress?: string;
  SoulboundGreenAddress?: string;
  DataStaking?: string;
  DataPointsMulti?: string;
}
