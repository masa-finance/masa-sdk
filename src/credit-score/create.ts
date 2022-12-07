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
    if (creditScoreResponse?.signature) {
      const tx = await masa.contracts.mintCreditScore(
        creditScoreResponse.signature
      );
    }
  }
};
