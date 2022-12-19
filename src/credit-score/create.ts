import Masa from "../masa";
import { CreateCreditScoreResult } from "../interface";

export const createCreditScore = async (
  masa: Masa
): Promise<CreateCreditScoreResult | undefined> => {
  const result: CreateCreditScoreResult = {
    success: false,
    message: "Unknown Error",
  };

  if (await masa.session.checkLogin()) {
    console.log("Creating Credit Score!");

    const { identityId, address } = await masa.identity.load();
    if (!identityId) {
      result.message = `No Identity found for address ${address}`;
      return result;
    }

    const balance =
      await masa.contracts.identity.SoulboundCreditScoreContract.balanceOf(
        address
      );

    if (balance.toNumber() > 0) {
      result.message = "Credit Score already created!";
      return result;
    }

    const creditScoreResponse: any = await masa.client.createCreditScore(
      address
    );

    if (creditScoreResponse?.signature) {
      const wallet = masa.config.wallet;

      try {
        const tx = await masa.contracts.mintCreditScore(
          wallet,
          "eth",
          creditScoreResponse.signatureDate,
          address,
          creditScoreResponse.signature
        );

        console.log("Waiting for transaction to finalize");

        const transactionReceipt = await tx.wait();
        const creditScoreUpdateResponse = await masa.client.updateCreditScore(
          transactionReceipt.transactionHash
        );

        return { ...result, ...creditScoreUpdateResponse };
      } catch (e: any) {
        result.success = false;
        result.message = `Unexpected error: ${e.message}`;
        console.error(result.message);
      }
    }
  }

  return result;
};
