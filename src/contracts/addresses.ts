import { NetworkName, Tokens } from "../interface";
import {
  alfajores,
  basegoerli,
  bsc,
  bsctest,
  celo,
  ethereum,
  goerli,
  mumbai,
  polygon,
} from "./networks";

export interface Addresses {
  tokens?: Tokens;
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
