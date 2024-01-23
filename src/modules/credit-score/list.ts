import { Messages } from "../../collections";
import type { CreditScoreDetails, MasaInterface } from "../../interface";
import { logger } from "../../utils";
import { loadCreditScores } from "./load";

export const listCreditScores = async (
  masa: MasaInterface,
  address?: string,
): Promise<CreditScoreDetails[]> => {
  address = address ?? (await masa.config.signer.getAddress());

  const { identityId } = await masa.identity.load(address);
  if (!identityId) {
    logger("warn", Messages.NoIdentity(address));
  }

  return await loadCreditScores(masa, identityId ?? address);
};

export const listCreditScoresAndPrint = async (
  masa: MasaInterface,
  address?: string,
): Promise<CreditScoreDetails[]> => {
  const creditScores = await listCreditScores(masa, address);

  if (creditScores.length === 0) {
    logger("warn", "No Credit Scores found!");
  }

  let i = 1;
  for (const creditScore of creditScores) {
    logger("log", `Token: ${i}`);
    logger("log", `Token ID: ${creditScore.tokenId.toNumber()}`);
    i++;
    if (creditScore.metadata && masa.config.verbose) {
      logger(
        "info",
        `Metadata: ${JSON.stringify(creditScore.metadata, null, 2)}`,
      );
    }

    logger(
      "log",
      `Score: ${creditScore.metadata?.properties.value ?? "Unknown"}`,
    );
  }

  return creditScores;
};
