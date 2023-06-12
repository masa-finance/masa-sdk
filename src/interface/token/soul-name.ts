import { BigNumber } from "ethers";

import { BaseResult } from "../base-result";

export interface Attribute {
  display_type?: string;
  trait_type: string;
  value: number | string;
}

export interface ISoulName {
  description: "This is a soul name!";
  external_url:
    | "https://app.basecamp.global"
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

export interface SoulNameDetails {
  owner: string;
  tokenUri: string;
  tokenDetails: {
    sbtName: string;
    extension: string;
    linked: boolean;
    identityId: BigNumber;
    tokenId: BigNumber;
    expirationDate: BigNumber;
    active: boolean;
  };
  metadata: ISoulName;
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

export interface CreateSoulNameResult extends SoulNameResultBase {
  soulName?: string;
}

export interface SoulNameMetadataStoreResult extends SoulNameResultBase {
  // image info
  imageTransaction: {
    id: string;
  };
  // metadata info
  metadataTransaction: {
    id: string;
  };
  // signature from the authority to be verified in the contract
  signature: string;
  // signer address
  authorityAddress: string;
}
