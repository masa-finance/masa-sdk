import Masa from "../masa";
import { unpackSessionId } from "../helpers";
import { BigNumber } from "ethers";
import { Templates } from "../utils";

export const login = async (
  masa: Masa
): Promise<
  | {
      address: string;
      userId: BigNumber | string;
      cookie: string;
    }
  | undefined
> => {
  console.log("Logging in");

  if (await masa.session.checkLogin()) {
    console.log("Already logged in! Please logout before logging in again.");
  } else {
    // get challenge
    const challengeData = await masa.client.getChallenge();

    if (challengeData) {
      // sign
      const msg = Templates.loginTemplate(
        challengeData.challenge,
        challengeData.expires
      );

      const address = await masa.config.wallet.getAddress();

      console.log(`Signer Address: '${address}'`);
      console.log(`Signing: \n'${msg}'\n`);

      const signature = await masa.config.wallet.signMessage(msg);
      console.log(`Signature: '${signature}'`);

      const checkSignatureData = await masa.client.checkSignature(
        address,
        signature,
        challengeData.cookie
      );

      if (checkSignatureData) {
        console.log("\nLogged in as:");
        console.log(`Address: '${address}'`);
        console.log(`User ID: '${checkSignatureData.id}'`);
        console.log(`Session ID: '${unpackSessionId(challengeData.cookie)}'`);

        return {
          address,
          userId: checkSignatureData.id,
          cookie: challengeData.cookie,
        };
      }
    }
  }
};
