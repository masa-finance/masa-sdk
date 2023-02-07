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

export interface CreateGreenResult extends BaseResult {
  status?: string;
}