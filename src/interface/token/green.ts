import { BaseResult } from "../masa";

export interface IGreen {
  name: "Masa Soulbound Green 2FA v1.0.0";
  description: "A decentralized 2FA";
  image: "https://metadata.masa.finance/v1.0/2fa/2fa.png";
  properties: {
    tokenId: string;
    identityId?: string;
    account?: string;
  };
}

export interface CreateGreenResult extends BaseResult {
  status?: string;
}
