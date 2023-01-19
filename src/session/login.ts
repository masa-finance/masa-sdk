import Masa from "../masa";
import { unpackSessionId } from "../helpers";
import { BigNumber } from "ethers";
import { signMessage, Templates } from "../utils";

export const login = async (
  masa: Masa
): Promise<
  | {
      address: string;
      userId: BigNumber | string;
      cookie?: string;
    }
  | undefined
> => {
  console.log("Logging in");

  if (!(await masa.session.checkLogin())) {
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

      const signature = await signMessage(msg, masa.config.wallet);
      console.log(`Signature: '${signature}'`);

      if (signature) {
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
      } else {
        console.error("Creating signature failed!");
      }
    }
  } else {
    console.error("Already logged in! Please logout before logging in again.");
  }
};
