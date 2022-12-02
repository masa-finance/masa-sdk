import Masa from "../masa";
import { signMessage, Templates } from "../utils";
import { CreateCreditScoreResult } from "../interface";

export const createCreditScore = async (
  masa: Masa
): Promise<CreateCreditScoreResult> => {
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

    const msg = Templates.creditScoreTemplate(identityId.toString(), address);

    console.log(`Signer Address: '${address}'`);
    console.log(`Signing: \n'${msg}'\n`);

    // 1. creat signature
    const signature = await signMessage(msg, masa.config.wallet);
    console.log(`Signature: '${signature}'`);

    // if we have a signature
    if (signature) {
      // 2. mint credit score
      console.log("\nCreating Credit Score");
      const creditScoreMintData = await masa.creditScore.mint(
        address,
        signature
      );

      if (creditScoreMintData) {
        const { success, message, tokenId } = creditScoreMintData;

        result.success = success;
        result.message = message;

        if (success) {
          result.tokenId = tokenId;
        } else {
          console.error(`Creating Credit Score failed! '${message}'`);
        }
      }
    } else {
      result.message = "Creating signature failed!";
      console.error(result.message);
    }
  } else {
    result.message = "Not logged, in please login first!";
    console.error(result.message);
  }

  return result;
};
