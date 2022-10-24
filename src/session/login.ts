import { getLoginTemplate } from "./get-logintemplate";
import Masa from "../masa";
import { unpackSessionId } from "../helpers/unpack-session-id"

export const login = async (masa: Masa) => {
  console.log("Logging in");

  if (await masa.session.checkLogin()) {
    console.log("Already logged in! Please logout before logging in again.");
  } else {
    // get challenge
    const challengeData = await masa.client.getChallenge();

    if (challengeData) {
      // sign
      const msg = getLoginTemplate(
        challengeData.challenge,
        challengeData.expires
      );

      const signer = await masa.config.provider?.getSigner();
      if (!signer) return;

      const address = await signer.getAddress();

      console.log(`Signer Address: '${address}'`);
      console.log(`Signing: \n'${msg}'\n`);

      const signature = await signer.signMessage(msg);
      console.log(`Signature: '${signature}'`);

      const checkSignatureData = await masa.client.checkSignature(
        address,
        signature,
        masa.config.cookie
      );

      if (checkSignatureData) {
        console.log("\nLogged in as:");
        console.log(`Address: '${address}'`);
        console.log(`User ID: '${checkSignatureData.id}'`);

        if (challengeData.cookie) {
          console.log(`Session ID: '${unpackSessionId(challengeData.cookie)}'`);
        }
      }
    }
  }
};
