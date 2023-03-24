import { BaseResult } from "../masa";
import Transaction from "arweave/node/lib/transaction";

export interface Attribute {
  display_type?: string;
  trait_type: string;
  value: number | string;
}

export interface ISoulName {
  description: "This is a soul name!";
  external_url:
    | "https://app.getbasecamp.xyz"
    | "https://app.prosperity.global"
    | "https://testnet.app.masa.finance"
    | "https://app.masa.finance";
  name: string;
  image: string;
  imageHash: string;
  imageHashSignature: string;
  network: string;
  chainId: string;
  signature: string;
  attributes: Attribute[];
}

export enum SoulNameErrorCodes {
  NoError,
  ArweaveError,
  NetworkError,
  CryptoError,
  SoulNameError,
  UnknownError = 1337,
}

export interface SoulNameResultBase extends BaseResult {
  errorCode: SoulNameErrorCodes;
}

export const isSoulNameMetadataStoreResult = (
  result: SoulNameResultBase
): result is SoulNameMetadataStoreResult => {
  return !!(result as SoulNameMetadataStoreResult).authorityAddress;
};

export interface CreateSoulNameResult extends SoulNameResultBase {
  soulName?: string;
}

export interface SoulNameMetadataStoreResult extends SoulNameResultBase {
  // image info
  imageTransaction: Transaction;
  imageResponse: {
    status: number;
    statusText: string;
    data: unknown;
  };
  // metadata info
  metadataTransaction: Transaction;
  metadataResponse: {
    status: number;
    statusText: string;
    data: unknown;
  };
  // signature from the authority to be verified in the contract
  signature: string;
  // signer address
  authorityAddress: string;
}
