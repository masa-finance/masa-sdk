import { BaseResult } from "../masa";

export interface Attribute {
  display_type?: string;
  trait_type: string;
  value: number | string;
}

export interface ISoulName {
  description: "This is a soul name!";
  external_url: "https://testnet.app.masa.finance" | "https://app.masa.finance";
  name: string;
  image: string;
  imageHash: string;
  imageHashSignature: string;
  network: string;
  chainId: string;
  signature: string;
  attributes: Attribute[];
}

export interface CreateSoulNameResult extends BaseResult {
  soulName?: string;
}
