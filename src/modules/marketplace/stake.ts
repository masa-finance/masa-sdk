import { BigNumber } from "ethers";

import type { BaseResult, MasaInterface } from "../../interface";

export const stake = async (
  masa: MasaInterface,
  tokenId: BigNumber,
): Promise<BaseResult> => {
  return masa.contracts.marketplace.stake(tokenId);
};
