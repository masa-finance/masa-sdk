import { NetworkName } from "../interface";
import { Addresses } from "../interface/addresses";
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
