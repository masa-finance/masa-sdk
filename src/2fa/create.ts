import Masa from "../masa";
import { signMessage, Templates } from "../utils";
import { Create2FAResult } from "../interface";

export const create2FA = async (
  masa: Masa,
  phoneNumber: string,
  code: string
): Promise<Create2FAResult> => {
  const result: Create2FAResult = {
    success: false,
    message: "Unknown Error",
  };

  if (await masa.session.checkLogin()) {
    const { identityId, address } = await masa.identity.load();
    if (!identityId) {
      result.message = `No Identity found for address ${address}`;
      return result;
    }

    // generate message to sign
    const msg = Templates.twoFATemplate(
      identityId.toString(),
      phoneNumber,
      code
    );

    console.log(`Signer Address: '${address}'`);
    console.log(`Signing: \n'${msg}'\n`);

    // 1. creat signature
    const signature = await signMessage(msg, masa.config.wallet);
    console.log(`Signature: '${signature}'`);

    // if we got a signature
    if (address && signature) {
      // 2. mint 2FA
      console.log("\nCreating 2FA");
      const mint2FAData = await masa.twoFA.mint(
        address,
        phoneNumber,
        code,
        signature
      );

      if (mint2FAData) {
        const { success, status, message, tokenId } = mint2FAData;

        result.success = success;
        result.status = status;
        result.message = message;

        if (success) {
          console.log(`2FA Created: '${tokenId}'`);
          result.tokenId = tokenId;
        } else {
          console.error(`Creating 2FA failed! '${message}'`);
        }

        return result;
      }
    } else {
      result.message = "Creating signature failed!";
      console.error(result.message);
    }
  } else {
    result.message = "Not logged in, please login first!";
    console.error(result.message);
  }

  return result;
};
