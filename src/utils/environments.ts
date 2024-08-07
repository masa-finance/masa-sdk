import type { Signer } from "ethers";

import type { MasaArgs } from "../interface";

// special type for env config that makes wallet optional
export type Environment = {
  wallet?: Signer;
} & MasaArgs;

export const environments: Environment[] = [
  {
    environment: "local",
    apiUrl: "http://localhost:4000/",
    networkName: "sepolia",
    arweave: {
      host: "arweave.net",
      port: 443,
      protocol: "https",
      logging: false,
    },
  } as Environment,
  {
    environment: "dev",
    apiUrl: "https://dev.api.cookiemonster.masa.finance/",
    networkName: "sepolia",
    arweave: {
      host: "arweave.net",
      port: 443,
      protocol: "https",
      logging: false,
    },
  } as Environment,
  {
    environment: "stage",
    apiUrl: "https://stage.api.cookiemonster.masa.finance/",
    networkName: "sepolia",
    arweave: {
      host: "arweave.net",
      port: 443,
      protocol: "https",
      logging: false,
    },
  } as Environment,
  {
    environment: "production",
    apiUrl: "https://api.cookiemonster.masa.finance/",
    networkName: "ethereum",
    arweave: {
      host: "arweave.net",
      port: 443,
      protocol: "https",
      logging: false,
    },
  } as Environment,
];
