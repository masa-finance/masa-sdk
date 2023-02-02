import { alfajores, bsctest, goerli, mainnet, mumbai } from "./networks";
import { NetworkName } from "../interface";

export interface Addresses {
  USDC?: string;
  WETH?: string;
  MASA?: string;
  SoulboundIdentityAddress?: string;
  SoulboundCreditScoreAddress?: string;
  SoulNameAddress?: string;
  SoulStoreAddress?: string;
  SoulLinkerAddress?: string;
  SoulboundGreenAddress?: string;
}

export const addresses: Partial<{ [key in NetworkName]: Addresses }> = {
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
