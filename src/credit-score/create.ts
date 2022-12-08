import Masa from "../masa";
import { signMessage, Templates } from "../utils";
import { CreateCreditScoreResult } from "../interface";
// Promise<CreateCreditScoreResult>
export const createCreditScore = async (masa: Masa) => {
  const result: CreateCreditScoreResult = {
    success: false,
    message: "Unknown Error",
  };

  if (await masa.session.checkLogin()) {
    const address = await masa.config.wallet.getAddress();

    const identityId = await masa.identity.load(address);
    if (!identityId) {
      result.message = "No Identity";
      return result;
    }

    const creditScoreResponse = await masa.client.createCreditScore(address);

    console.log({ creditScoreResponse });
    //@ts-ignore
    if (creditScoreResponse?.signature) {
     const wallet = masa.config.wallet;
    //@ts-ignore
     const date = new Date(creditScoreResponse.creditScore.lastUpdated).getTime();
    //@ts-ignore
      const tx = await masa.contracts.mintCreditScore(wallet, "eth", date, creditScoreResponse.creditScore.account , creditScoreResponse.signature)
      console.log("CREDIT SCORE",{tx})
    }
  }
};
