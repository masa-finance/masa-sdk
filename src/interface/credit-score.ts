export interface ICreditScore {
  name: "Masa Soulbound Credit Score v1.0.0";
  description: "A decentralized credit score";
  image: "https://metadata.masa.finance/v1.0/identity/credit-report.png";
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
