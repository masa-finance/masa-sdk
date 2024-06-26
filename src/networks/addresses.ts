import type { Addresses, NetworkName } from "../interface";
import { auroratest } from "./aurora";
import { base, basegoerli, basesepolia } from "./base";
import { bsc, bsctest } from "./bsc";
import { alfajores, celo } from "./celo";
import { ethereum, goerli, sepolia } from "./eth";
import { masa, masatest } from "./masa";
import { opbnb, opbnbtest } from "./opbnb";
import { amoy, mumbai, polygon } from "./polygon";
import { scroll, scrollsepolia } from "./scroll";

export const addresses: Partial<{ [key in NetworkName]: Addresses }> = {
  // masa
  masa,
  masatest,

  // eth
  ethereum,
  // @deprecated: use sepolia
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
  amoy,
  // @deprecated: use amoy
  polygon,

  // base
  base,
  basesepolia,
  // @deprecated: use basesepolia
  basegoerli,

  // scroll
  scroll,
  scrollsepolia,

  // aurora / NEAR
  auroratest,
};
