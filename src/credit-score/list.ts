import { Messages } from "../collections";
import type { CreditScoreDetails, MasaInterface } from "../interface";
import { loadCreditScores } from "./load";

export const listCreditScores = async (
  masa: MasaInterface,
  address?: string
): Promise<CreditScoreDetails[]> => {
  address = address || (await masa.config.signer.getAddress());

  const { identityId } = await masa.identity.load(address);
  if (!identityId) {
    console.warn(Messages.NoIdentity(address));
  }

  return await loadCreditScores(masa, identityId || address);
};

export const listCreditScoresAndPrint = async (
  masa: MasaInterface,
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
