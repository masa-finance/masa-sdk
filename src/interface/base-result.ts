import { BigNumber } from "ethers";

import { BaseErrorCodes } from "../collections";

export interface BaseResult {
  success: boolean;
  errorCode?: BaseErrorCodes | string | number;
  message?: string;
}

export interface BaseResultWithTokenId extends BaseResult {
  tokenId?: string | BigNumber;
}
