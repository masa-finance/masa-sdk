import { goerli, mainnet } from "./networks";

export interface Addresses {
  [index: string]: {
    USDC: string;
    WETH?: string;
    MASA?: string;
    SoulboundIdentityAddress: string;
    SoulboundCreditScoreAddress: string;
    SoulNameAddress: string;
    SoulStoreAddress: string;
    SoulLinkerAddress: string;
    Soulbound2FAAddress?: string;
  };
}

export const addresses: Addresses = {
  goerli,
  mainnet,
};
