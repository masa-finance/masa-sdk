import Masa from "../masa";
import { Messages } from "../utils";
import { MasaSBTSelfSovereign } from "@masa-finance/masa-contracts-identity";
import { BigNumber } from "ethers";

export const burnSBTById = async (
  masa: Masa,
  contract: MasaSBTSelfSovereign,
  SBTId: BigNumber
): Promise<boolean> => {
  try {
    const tx = await contract.connect(masa.config.wallet).burn(SBTId);
    console.log(Messages.WaitingToFinalize(tx.hash));
    await tx.wait();

    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Burning SBT Failed! '${error.message}'`);
    }
  }

  return false;
};

export const burnSBT = async (
  masa: Masa,
  contract: MasaSBTSelfSovereign,
  SBTId: BigNumber
): Promise<boolean> => {
  let success = false;

  if (await masa.session.checkLogin()) {
    console.log(`Burning SBT with ID '${SBTId}'!`);
    success = await burnSBTById(masa, contract, SBTId);

    if (success) {
      console.log(`Burned SBT with ID '${SBTId}'!`);
    }
  } else {
    console.error(Messages.NotLoggedIn());
  }

  return success;
};
