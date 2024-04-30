import { StakedEvent } from "@masa-finance/masa-contracts-staking/dist/typechain/contracts/MasaStaking";

import { BaseResult, MasaInterface } from "../../../interface";

/**
 *
 * @param masa
 * @param address
 */
export const show = async (
  masa: MasaInterface,
  address?: string,
): Promise<BaseResult & { logs?: StakedEvent[] }> => {
  const result: BaseResult & { logs?: StakedEvent[] } = {
    success: false,
  };

  address = address || (await masa.config.signer.getAddress());

  console.log(address);

  if (!masa.contracts.instances.MasaStaking.hasAddress) {
    result.message = `Unable to show on ${masa.config.networkName}!`;
    console.error(result.message);

    return result;
  }

  try {
    const {
      queryFilter,
      filters: { Staked },
    } = masa.contracts.instances.MasaStaking;

    const logs = await queryFilter(Staked(address));

    console.log(logs);

    result.logs = logs;
    result.success = true;
  } catch (error: unknown) {
    result.message = "Show failed!";

    if (error instanceof Error) {
      result.message = `${result.message}: ${error.message}`;
    }

    console.error(result.message);
  }

  return result;
};
