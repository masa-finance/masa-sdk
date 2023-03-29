import { BigNumber } from "ethers";
import Masa from "../masa";
import { Messages } from "../utils";

export const burnCreditScoreById = async (
  masa: Masa,
  creditScoreId: BigNumber
): Promise<boolean> => {
  try {
    console.log(`Burning Credit Score with ID '${creditScoreId}'!`);
    const { wait, hash } =
      await masa.contracts.instances.SoulboundCreditScoreContract.connect(
        masa.config.wallet
      ).burn(creditScoreId);

    console.log(Messages.WaitingToFinalize(hash));
    await wait();

    console.log(`Burned Credit Score with ID '${creditScoreId}'!`);
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Burning Credit Score Failed! '${error.message}'`);
    }
  }

  return false;
};

export const burnCreditScore = async (
  masa: Masa,
  creditScoreId: BigNumber
): Promise<boolean> => {
  const { identityId, address } = await masa.identity.load();
  if (!identityId) {
    console.error(Messages.NoIdentity(address));
    return false;
  }

  return burnCreditScoreById(masa, creditScoreId);
};
