import { BaseResult } from "./masa";

export interface I2FA {
  name: "Masa Soulbound 2FA v1.0.0";
  description: "A decentralized 2FA";
  image: "https://metadata.masa.finance/v1.0/2fa/2fa.png";
  properties: {
    tokenId: string;
    identityId?: string;
    account?: string;
  };
}

export interface Create2FAResult extends BaseResult {
  status?: string;
}
