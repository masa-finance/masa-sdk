import type { Addresses, NetworkName } from "../interface";
import { basegoerli } from "./base";
import { bsc, bsctest } from "./bsc";
import { alfajores, celo } from "./celo";
import { ethereum, goerli } from "./eth";
import { mumbai, polygon } from "./polygon";

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
