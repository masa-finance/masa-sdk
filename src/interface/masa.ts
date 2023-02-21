import { BigNumber, ethers } from "ethers";

export type EnvironmentName = "dev" | "test" | "beta" | "production";

export type NetworkName =
  // eth
  | "goerli" // testnet
  | "ethereum" // mainnet
  | "mainnet" // mainnet deprecated
  // celo
  | "alfajores" // testnet
  | "celo" // mainnet
  // polygon
  | "mumbai" // testnet
  | "polygon" // mainnet
  // BSC
  | "bsctest" // testnet
  | "bsc" // mainnet
  // fallback for unknown networks
  | "unknown";

export interface MasaArgs {
  cookie?: string;
  wallet: ethers.Signer | ethers.Wallet;
  apiUrl?: string;
  environment?: EnvironmentName;
  defaultNetwork?: NetworkName;
  verbose?: boolean;
  arweave?: {
    host: string;
    port: number;
    protocol: string;
    logging?: boolean;
  };
}

export interface MasaConfig {
  apiUrl: string;
  environment: string;
  network: NetworkName;
  wallet: ethers.Signer | ethers.Wallet;
  verbose: boolean;
}

export interface BaseResult {
  success: boolean;
  message: string;
  tokenId?: string | BigNumber;
}
