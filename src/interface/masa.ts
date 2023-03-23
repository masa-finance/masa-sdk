import { BigNumber, Signer, Wallet } from "ethers";
import { ApiConfig as ArweaveConfig } from "arweave/node/lib/api";
import { Network } from "../utils";

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
  // base
  | "basegoerli"
  // fallback for unknown networks
  | "unknown";

export interface MasaArgs {
  cookie?: string;
  wallet: Signer | Wallet;
  apiUrl?: string;
  environment?: EnvironmentName;
  networkName?: NetworkName;
  verbose?: boolean;
  arweave?: ArweaveConfig;
}

export interface MasaConfig {
  readonly apiUrl: string;
  readonly environment: string;
  readonly networkName: NetworkName;
  readonly network?: Network;
  readonly wallet: Signer | Wallet;
  readonly verbose: boolean;
}

export interface BaseResult {
  success: boolean;
  message: string;
  tokenId?: string | BigNumber;
}
