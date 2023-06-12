import { ApiConfig as ArweaveConfig } from "arweave/node/lib/api";
import { BigNumber, Signer } from "ethers";

import { Network } from "../utils";
import { IIdentityContracts } from "./contracts";

export type EnvironmentName = "dev" | "test" | "beta" | "production";

export type NetworkName =
  // eth
  | "goerli" // testnet
  | "ethereum" // mainnet
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
  signer: Signer;
  apiUrl?: string;
  environment?: EnvironmentName;
  networkName?: NetworkName;
  verbose?: boolean;
  arweave?: ArweaveConfig;
  contractOverrides?: Partial<IIdentityContracts>;
}

export interface MasaConfig {
  readonly apiUrl: string;
  readonly environment: string;
  readonly networkName: NetworkName;
  readonly network?: Network;
  readonly signer: Signer;
  readonly verbose: boolean;
}

export interface BaseResult {
  success: boolean;
  message: string;
  tokenId?: string | BigNumber;
}
