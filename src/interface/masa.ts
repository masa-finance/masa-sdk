import { BigNumber, ethers } from "ethers";

export interface MasaArgs {
  cookie?: string;
  wallet: ethers.Signer | ethers.Wallet;
  apiUrl?: string;
  environment?: string;
  network?: string;
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
}

export interface BaseResult {
  success: boolean;
  message: string;
  tokenId?: string | BigNumber;
}
