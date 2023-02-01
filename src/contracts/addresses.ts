import { alfajores, bsctest, goerli, mainnet, mumbai } from "./networks";

export interface Addresses {
  [index: string]: {
    USDC?: string;
    WETH?: string;
    MASA?: string;
    SoulboundIdentityAddress?: string;
    SoulboundCreditScoreAddress?: string;
    SoulNameAddress?: string;
    SoulStoreAddress?: string;
    SoulLinkerAddress?: string;
    SoulboundGreenAddress?: string;
  };
}

export const addresses: Addresses = {
  // eth
  goerli,
  mainnet,
  // bsc
  bsctest,
  // celo
  alfajores,
  // polygon
  mumbai,
};
