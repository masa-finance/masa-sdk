import { BaseResult } from "../masa";

export interface IGreen {
  name: "Masa Soulbound Green v1.0.0";
  description: "Masa Green is a decentralized authentication solution";
  image: "https://metadata.masa.finance/v1.0/green/green.png";
  properties: {
    tokenId: string;
    identityId?: string;
    account?: string;
  };
}

interface GreenBaseResult extends BaseResult {
  status?: string;
  errorCode?: number;
}

export interface GenerateGreenResult extends GreenBaseResult {
  channel?: string;
  data?: unknown[];
}

export interface VerifyGreenResult extends GreenBaseResult {
  signature?: string;
  signatureDate?: number;
  authorityAddress?: string;
}
