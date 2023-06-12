import { BigNumber } from "ethers";

export interface BaseResult {
  success: boolean;
  message: string;
  tokenId?: string | BigNumber;
}
