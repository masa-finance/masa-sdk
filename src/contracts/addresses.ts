import {
  alfajores,
  basegoerli,
  bsc,
  bsctest,
  celo,
  ethereum,
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
  ethereum,
  goerli,
  // deprecated
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
  // base
  basegoerli,
};
