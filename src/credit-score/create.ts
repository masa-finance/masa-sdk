import Masa from "../masa";
import { BigNumber } from "ethers";
import { Templates } from "../utils";

export const createCreditScore = async (
  masa: Masa
): Promise<
  | {
      tokenId: string | BigNumber;
      success: boolean;
      message: string;
    }
  | undefined
> => {
  if (await masa.session.checkLogin()) {
    const address = await masa.config.wallet.getAddress();

    const identityId = await masa.identity.load(address);
    if (!identityId) return;

    const msg = Templates.creditScoreTemplate(identityId.toString(), address);

    console.log(`Signer Address: '${address}'`);
    console.log(`Signing: \n'${msg}'\n`);

    // 1. creat signature
    const signature = await masa.config.wallet.signMessage(msg);
    console.log(`Signature: '${signature}'`);

    // 2. mint credit score
    console.log("\nCreating Credit Score");
    const storeMetadataData = await masa.creditScore.mint(address, signature);

    if (storeMetadataData) {
      const { success, message, tokenId } = storeMetadataData;

      if (!success) {
        console.error(`Creating Credit Score failed! '${message}'`);
      } else {
        return {
          tokenId,
          success,
          message,
        };
      }
    }
  } else {
    console.log("Not logged in please login first");
  }
};
