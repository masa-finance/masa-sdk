import type { BigNumber } from "ethers";

/**
 *
 * @param item
 */
export const isBigNumber = (item: BigNumber | string): item is BigNumber => {
  return (item as BigNumber)._isBigNumber;
};
