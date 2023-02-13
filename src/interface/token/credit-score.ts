import { BaseResult } from "../masa";

export interface ICreditScore {
  name: "Masa Soulbound Credit Score v1.0.0";
  description: "A decentralized credit score";
  image: "https://metadata.masa.finance/v1.0/credit-score/credit-score.png";
  properties: {
    tokenId: string;
    identityId?: string;
    account?: string;
    lastUpdated?: string;
    model_version?: string;
    value?: number;
    decile?: string;
    value_rating?: string;
  };
}

export interface GenerateCreditScoreResult extends BaseResult {
  signature?: string;
  signatureDate?: number;
  authorityAddress?: string;
}

export interface UpdateCreditScoreResult extends BaseResult {
  status?: string;
  signature?: string;
}
