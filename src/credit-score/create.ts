import Masa from "../masa";
import { CreateCreditScoreResult } from "../interface";

const mockTransactionHash =
  "0x6ba64f962b103b867c7a5cec2224aae31ebe5e472f77cda56fe5db05554930c6";

export const createCreditScore = async (
  masa: Masa,
  mock = false
): Promise<CreateCreditScoreResult | undefined> => {
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

    const creditScoreResponse: any = await masa.client.createCreditScore(
      address
    );

    if (creditScoreResponse?.signature) {
      if (!mock) {
        const wallet = masa.config.wallet;
        const date = new Date(
          creditScoreResponse.creditScore.lastUpdated
        ).getTime();

        try {
          const tx = await masa.contracts.mintCreditScore(
            wallet,
            "eth",
            date,
            creditScoreResponse.creditScore.account,
            creditScoreResponse.signature
          );

          console.log("Waiting for transaction to finalize");

          const transactionReceipt = await tx.wait();
          const creditScoreUpdateResponse = await masa.client.updateCreditScore(
            mock ? mockTransactionHash : transactionReceipt.transactionHash
          );

          return { ...result, ...creditScoreUpdateResponse };
        } catch (e: any) {
          result.success = false;
          result.message = `Unexpected error: ${e.message}`;
          console.error(result.message);
        }
      }
    }
  }

  return result;
};
