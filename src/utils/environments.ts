import { MasaArgs } from "../interface";
import { ethers } from "ethers";

// special type for env config that makes wallet optional
type Environment = {
  name: string;
  wallet?: ethers.Signer | ethers.Wallet;
} & MasaArgs;

export const environments: Environment[] = [
  {
    name: "local",
    environment: "dev",
    apiUrl: "http://localhost:4000/",
    network: "goerli",
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
    network: "goerli",
    arweave: {
      host: "arweave.net",
      port: 443,
      protocol: "https",
      logging: false,
    },
  } as Environment,
  {
    name: "test",
    environment: "test",
    apiUrl: "https://test.middleware.masa.finance/",
    network: "goerli",
    arweave: {
      host: "arweave.net",
      port: 443,
      protocol: "https",
      logging: false,
    },
  } as Environment,
  {
    name: "stage",
    environment: "stage",
    apiUrl: "https://beta.middleware.masa.finance/",
    network: "goerli",
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
    network: "mainnet",
    arweave: {
      host: "arweave.net",
      port: 443,
      protocol: "https",
      logging: false,
    },
  } as Environment,
];
