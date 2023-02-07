import Masa from "../masa";
import { BigNumber } from "ethers";
import { Messages } from "../utils";

export const burnCreditScoreById = async (
  masa: Masa,
  creditScoreId: BigNumber
): Promise<boolean> => {
  try {
    const tx =
      await masa.contracts.instances.SoulboundCreditScoreContract.connect(
        masa.config.wallet
      ).burn(creditScoreId);

    console.log(Messages.WaitingToFinalize(tx.hash));
    await tx.wait();

    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Burning of Credit Score Failed! '${error.message}'`);
    }
  }

  return false;
};

export const burnCreditScore = async (
  masa: Masa,
  creditScoreId: BigNumber
): Promise<boolean> => {
  let burned = false;

  if (await masa.session.checkLogin()) {
    const { identityId } = await masa.identity.load();
    if (!identityId) {
      return burned;
    }

    burned = await burnCreditScoreById(masa, creditScoreId);

    if (burned) {
      console.log(`Credit Score with ID '${creditScoreId}' burned!`);
    }
  } else {
    console.error(Messages.NotLoggedIn());
  }

  return burned;
};
