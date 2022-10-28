import { MasaArgs } from "../interface";
import { createRandomWallet } from "../account";

export const environments: ({ name: string } & MasaArgs)[] = [
  {
    name: "local",
    environment: "dev",
    apiUrl: "http://localhost:4000/",
    network: "goerli",
    wallet: createRandomWallet(),
    arweave: {
      host: "arweave.net",
      port: 443,
      protocol: "https",
      logging: false,
    },
  },
  {
    name: "dev",
    environment: "dev",
    apiUrl: "https://dev.middleware.masa.finance/",
    network: "goerli",
    wallet: createRandomWallet(),
    arweave: {
      host: "arweave.net",
      port: 443,
      protocol: "https",
      logging: false,
    },
  },
  {
    name: "test",
    environment: "test",
    apiUrl: "https://test.middleware.masa.finance/",
    network: "goerli",
    wallet: createRandomWallet(),
    arweave: {
      host: "arweave.net",
      port: 443,
      protocol: "https",
      logging: false,
    },
  },
  {
    name: "stage",
    environment: "stage",
    apiUrl: "https://beta.middleware.masa.finance/",
    network: "goerli",
    wallet: createRandomWallet(),
    arweave: {
      host: "arweave.net",
      port: 443,
      protocol: "https",
      logging: false,
    },
  },
  {
    name: "production",
    environment: "production",
    apiUrl: "https://middleware.masa.finance/",
    network: "mainnet",
    wallet: createRandomWallet(),
    arweave: {
      host: "arweave.net",
      port: 443,
      protocol: "https",
      logging: false,
    },
  },
];
