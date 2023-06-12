import { Signer } from "ethers";

import { MasaArgs } from "../interface";

// special type for env config that makes wallet optional
export type Environment = {
  name: "local" | "dev" | "test" | "stage" | "production";
  wallet?: Signer;
} & MasaArgs;

export const environments: Environment[] = [
  {
    name: "local",
    environment: "dev",
    apiUrl: "http://localhost:4000/",
    networkName: "goerli",
    arweave: {
      host: "arweave.net",
      port: 443,
      protocol: "https",
      logging: false,
    },
  } as Environment,
  {
    name: "dev",
    environment: "dev",
    apiUrl: "https://dev.middleware.masa.finance/",
    networkName: "goerli",
    arweave: {
      host: "arweave.net",
      port: 443,
      protocol: "https",
      logging: false,
    },
  } as Environment,
  {
    name: "stage",
    environment: "beta",
    apiUrl: "https://beta.middleware.masa.finance/",
    networkName: "goerli",
    arweave: {
      host: "arweave.net",
      port: 443,
      protocol: "https",
      logging: false,
    },
  } as Environment,
  {
    name: "production",
    environment: "production",
    apiUrl: "https://middleware.masa.finance/",
    networkName: "ethereum",
    arweave: {
      host: "arweave.net",
      port: 443,
      protocol: "https",
      logging: false,
    },
  } as Environment,
];
