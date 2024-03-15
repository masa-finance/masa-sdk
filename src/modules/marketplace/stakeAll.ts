import type { BaseResult, MasaInterface } from "../../interface";

export const stakeAll = async (
  masa: MasaInterface,
): Promise<BaseResult> => {
  return masa.contracts.marketplace.stakeAll();
};