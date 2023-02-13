import Masa from "../masa";
import { GenerateCreditScoreResult } from "../interface";
import { PaymentMethod } from "../contracts";
import { ethers } from "ethers";
import { Messages } from "../utils";

export const createCreditScore = async (
  masa: Masa,
  paymentMethod: PaymentMethod = "eth"
): Promise<GenerateCreditScoreResult | undefined> => {
  const result: GenerateCreditScoreResult = {
    success: false,
    message: "Unknown Error",
  };

  if (await masa.session.checkLogin()) {
    console.log("Creating Credit Score!");

    const { identityId, address } = await masa.identity.load();
    if (!identityId || !address) {
      result.message = Messages.NoIdentity(address);
      return result;
    }

    const balance =
      await masa.contracts.instances.SoulboundCreditScoreContract.balanceOf(
        address
      );

    if (balance.toNumber() > 0) {
      result.message = "Credit Score already created!";
      return result;
    }

    const creditScoreResponse = await masa.client.creditScore.generate();

    if (
      creditScoreResponse?.signature &&
      creditScoreResponse?.signatureDate &&
      creditScoreResponse?.authorityAddress
    ) {
      try {
        const tx = await masa.contracts.creditScore.mint(
          masa.config.wallet as ethers.Wallet,
          paymentMethod,
          identityId,
          creditScoreResponse.authorityAddress,
          creditScoreResponse.signatureDate,
          creditScoreResponse.signature
        );

        console.log(Messages.WaitingToFinalize(tx.hash));
        const transactionReceipt = await tx.wait();

        console.log("Updating Credit Score Record!");
        const creditScoreUpdateResponse = await masa.client.creditScore.update(
          transactionReceipt.transactionHash
        );

        if (masa.config.verbose) {
          console.log({ creditScoreUpdateResponse });
        }

        return { ...result, ...creditScoreUpdateResponse };
      } catch (error: unknown) {
        result.success = false;

        if (error instanceof Error) {
          result.message = `Unexpected error: ${error.message}`;
          console.error(result.message);
        }
      }
    }
  }

  return result;
};
