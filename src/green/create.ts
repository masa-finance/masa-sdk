import Masa from "../masa";
import { CreateGreenResult } from "../interface";
import { PaymentMethod } from "../contracts";
import { ethers } from "ethers";
import { Messages } from "../utils/messages";

export const createGreen = async (
  masa: Masa,
  phoneNumber: string,
  code: string,
  paymentMethod: PaymentMethod = "eth"
): Promise<CreateGreenResult> => {
  const result: CreateGreenResult = {
    success: false,
    message: "Unknown Error",
  };

  if (await masa.session.checkLogin()) {
    const { identityId, address } = await masa.identity.load();
    if (!identityId) {
      result.message = Messages.NoIdentity(address);
      return result;
    }

    const greenVerifyResult = await masa.client.green.verify(phoneNumber, code);

    console.log({ greenVerifyResult });
    if (
      greenVerifyResult?.signature &&
      greenVerifyResult?.signatureDate &&
      greenVerifyResult?.authorityAddress
    ) {
      console.log("Minting green");

      const tx = await masa.contracts.green.mint(
        masa.config.wallet as ethers.Wallet,
        paymentMethod,
        identityId,
        greenVerifyResult.authorityAddress,
        greenVerifyResult.signatureDate,
        greenVerifyResult.signature
      );

      console.log(Messages.WaitingToFinalize(tx.hash));
      await tx.wait();
    }
  } else {
    result.message = "Not logged in, please login first!";
    console.error(result.message);
  }

  return result;
};
