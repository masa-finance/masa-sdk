import { BigNumber, ethers } from "ethers";

export type EnvironmentName = "dev" | "test" | "beta" | "production";
export type NetworkName =
  // eth
  | "goerli" // testnet
  | "mainnet" // mainnet
  // celo
  | "alfajores" // testnet
  | "celo" // mainnet
  // polygon
  | "mumbai" // testnet
  | "polygon" // mainnet
  // BSC
  | "bsctest" // testnet
  | "bsc"; // mainnet

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
  network: string;
  wallet: ethers.Signer | ethers.Wallet;
  verbose: boolean;
}

export interface BaseResult {
  success: boolean;
  message: string;
  tokenId?: string | BigNumber;
}

export interface ISession {
  cookie: {
    originalMaxAge: number;
    expires: string;
    secure: boolean;
    httpOnly: boolean;
    domain: string;
    path: string;
    sameSite: string;
  };
  challenge: string;
  user: {
    userId: string;
    address: string;
  };
}
