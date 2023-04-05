import Masa from "../masa";
import { Messages } from "../utils";
import { CreditScoreDetails } from "../interface";
import { loadCreditScores } from "./";

export const listCreditScores = async (
  masa: Masa,
  address?: string
): Promise<CreditScoreDetails[]> => {
  address = address || (await masa.config.wallet.getAddress());

  const { identityId } = await masa.identity.load(address);
  if (!identityId) {
    console.warn(Messages.NoIdentity(address));
  }

  return await loadCreditScores(masa, identityId || address);
};

export const listCreditScoresAndPrint = async (
  masa: Masa,
  address?: string
): Promise<CreditScoreDetails[]> => {
  const creditScores = await listCreditScores(masa, address);

  if (creditScores.length === 0) {
    console.warn("No Credit Scores found!");
  }

  let i = 1;
  for (const creditScore of creditScores) {
    console.log(`Token: ${i}`);
    console.log(`Token ID: ${creditScore.tokenId}`);
    i++;
    if (creditScore.metadata && masa.config.verbose) {
      console.info(
        `Metadata: ${JSON.stringify(creditScore.metadata, null, 2)}`
      );
    }

    console.log(
      `Score: ${creditScore.metadata?.properties.value || "Unknown"}`
    );
  }

  return creditScores;
};
