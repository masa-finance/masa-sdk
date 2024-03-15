import type { BaseResult, MasaInterface } from "../../interface";

export const claimAllRewards = async (
  masa: MasaInterface,
): Promise<BaseResult> => {
  return masa.contracts.marketplace.claimAllRewards();
};