import { BigNumber } from "ethers";

export interface BaseResult {
  success: boolean;
  message?: string;
}

export interface BaseResultWithTokenId extends BaseResult {
  tokenId?: string | BigNumber;
}
