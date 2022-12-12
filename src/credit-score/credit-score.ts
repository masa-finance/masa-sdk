import { createCreditScore } from "./create";
import { burnCreditScore } from "./burn";
import { listCreditScores, loadCreditScoresByIdentityId } from "./list";
import { BigNumber } from "ethers";
import Masa from "../masa";

export const creditScore = (masa: Masa) => ({
  mint: (address: string, signature: string) =>
    masa.client.creditScoreMint(address, signature),
  create: (mock?: boolean) => createCreditScore(masa, mock),
  burn: (creditScoreId: number) => burnCreditScore(masa, creditScoreId),
  list: (address?: string) => listCreditScores(masa, address),
  load: (identityId: BigNumber) =>
    loadCreditScoresByIdentityId(masa, identityId),
});
