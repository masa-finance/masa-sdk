import Masa from "../masa";
import { CreateCreditScoreResult } from "../interface";
import { PaymentMethod } from "../contracts";
import { ethers } from "ethers";

export const createCreditScore = async (
  masa: Masa,
  paymentMethod: PaymentMethod = "eth"
): Promise<CreateCreditScoreResult | undefined> => {
  const result: CreateCreditScoreResult = {
    success: false,
    message: "Unknown Error",
  };

  if (await masa.session.checkLogin()) {
    const address = await masa.config.wallet.getAddress();

    console.log("Creating Credit Score!");

    const identityId = await masa.identity.load();
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

    const creditScoreResponse = await masa.client.createCreditScore();

    if (
      creditScoreResponse?.signature &&
      creditScoreResponse?.signatureDate &&
      creditScoreResponse?.authorityAddress
    ) {
      try {
        const tx = await masa.contracts.mintCreditScore(
          masa.config.wallet as ethers.Wallet,
          paymentMethod,
          identityId,
          creditScoreResponse.authorityAddress,
          creditScoreResponse.signatureDate,
          creditScoreResponse.signature
        );

        console.log("Waiting for transaction to finalize");

        const transactionReceipt = await tx.wait();

        console.log("Updating Credit Score Record!");
        const creditScoreUpdateResponse = await masa.client.updateCreditScore(
          transactionReceipt.transactionHash
        );

        return { ...result, ...creditScoreUpdateResponse };
      } catch (err: any) {
        result.success = false;
        result.message = `Unexpected error: ${err.message}`;
        console.error(result.message);
      }
    }
  }

  return result;
};
