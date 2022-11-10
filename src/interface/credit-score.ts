import { BigNumber } from "ethers";

export interface ICreditScore {
  name: "Masa Soulbound Credit Score v1.0.0";
  description: "A decentralized credit score";
  image: "https://metadata.masa.finance/v1.0/credit-score/credit-score.png";
  properties: {
    tokenId: string;
    account?: string;
    lastUpdated?: string;
    model_version?: string;
    value?: number;
    decile?: string;
    value_rating?: string;
  };
}

export interface CreateCreditScoreResult {
  tokenId?: string | BigNumber;
  success: boolean;
  message: string;
}
