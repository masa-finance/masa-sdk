import Masa from "../masa";
import { BigNumber } from "ethers";

export const create2fa = async (
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

    // todo do something cooler here
    const msg = `${address}`;

    console.log(`Signer Address: '${address}'`);
    console.log(`Signing: \n'${msg}'\n`);

    // 1. creat signature
    const signature = await masa.config.wallet.signMessage(msg);
    console.log(`Signature: '${signature}'`);

    // 2. mint 2fa
    console.log("\nCreating 2fa");
    const storeMetadataData = await masa.twofa.mint(address, signature);

    if (storeMetadataData) {
      const { success, message, tokenId } = storeMetadataData;

      if (!success) {
        console.error(`Creating 2fa failed! '${message}'`);
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