import * as goerli from "./networks/goerli";

export interface Addresses {
  [index: string]: {
    MASA: string;
    USDC: string;
    WETH: string;
    SoulboundIdentityAddress: string;
    SoulboundCreditScoreAddress: string;
    SoulNameAddress: string;
    SoulStoreAddress: string;
    SoulLinkerAddress: string;
    Soulbound2FAAddress: string;
  };
}

export const addresses: Addresses = {
  goerli,
};
