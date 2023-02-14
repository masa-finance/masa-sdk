import {
  alfajores,
  bsc,
  bsctest,
  celo,
  goerli,
  mainnet,
  mumbai,
  polygon,
} from "./networks";
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
  bsc,
  bsctest,
  // celo
  celo,
  alfajores,
  // polygon
  mumbai,
  polygon,
};
