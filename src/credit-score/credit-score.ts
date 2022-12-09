import { createCreditScore } from "./create";
import { burnCreditScore } from "./burn";
import { listCreditReports, loadCreditScoresByIdentityId } from "./list";
import { BigNumber } from "ethers";
import Masa from "../masa";

export const creditScore = (masa: Masa) => ({
  mint: (address: string, signature: string) =>
    masa.client.creditScoreMint(address, signature),
  create: (mock?: boolean) => createCreditScore(masa, mock),
  burn: (creditReportId: number) => burnCreditScore(masa, creditReportId),
  list: (address?: string) => listCreditReports(masa, address),
  load: (identityId: BigNumber) =>
    loadCreditScoresByIdentityId(masa, identityId),
});
