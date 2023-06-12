import type {
  MasaSBT,
  MasaSBTAuthority,
  MasaSBTSelfSovereign,
} from "@masa-finance/masa-contracts-identity";
import type { BigNumber } from "ethers";

import { Messages } from "../../collections";
import type { MasaInterface } from "../../interface";

export const burnSBT = async (
  masa: MasaInterface,
  contract: MasaSBTSelfSovereign | MasaSBTAuthority | MasaSBT,
  SBTId: BigNumber
): Promise<boolean> => {
  try {
    console.log(`Burning SBT with ID '${SBTId}'!`);

    const {
      estimateGas: { burn: estimateGas },
      burn,
    } = contract.connect(masa.config.signer);

    const gasLimit: BigNumber = await estimateGas(SBTId);

    const { wait, hash } = await burn(SBTId, { gasLimit });

    console.log(Messages.WaitingToFinalize(hash));
    await wait();

    console.log(`Burned SBT with ID '${SBTId}'!`);
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Burning SBT Failed! '${error.message}'`);
    }
  }

  return false;
};
