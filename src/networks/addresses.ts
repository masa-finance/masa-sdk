import type { Addresses, NetworkName } from "../interface";
import { base, basegoerli } from "./base";
import { bsc, bsctest } from "./bsc";
import { alfajores, celo } from "./celo";
import { ethereum, goerli, sepolia } from "./eth";
import { opbnb, opbnbtest } from "./opbnb";
import { mumbai, polygon } from "./polygon";
import { scroll, scrollsepolia } from "./scroll";

export const addresses: Partial<{ [key in NetworkName]: Addresses }> = {
  // eth
  ethereum,
  // @deprecated use sepolia
  goerli,
  sepolia,
  // bsc
  bsc,
  bsctest,
  // opbnb
  opbnb,
  opbnbtest,
  // celo
  celo,
  alfajores,
  // polygon
  mumbai,
  polygon,
  // base
  base,
  basegoerli,
  // scroll
  scroll,
  scrollsepolia,
};
