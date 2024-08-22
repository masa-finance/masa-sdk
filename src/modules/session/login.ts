import type { BigNumber } from "ethers";

import { Templates } from "../../collections";
import type { BaseResult, MasaInterface } from "../../interface";
import { isSigner, signMessage, unpackSessionId } from "../../utils";

export interface LoginResult extends BaseResult {
  address?: string;
  userId?: BigNumber | string;
  cookie?: string;
}

export const login = async (masa: MasaInterface): Promise<LoginResult> => {
  console.log("Logging in");

  let result: LoginResult = { success: false };

  if (!(await masa.session.checkLogin())) {
    // get challenge
    const challengeData = await masa.client.session.getChallenge();

    if (challengeData && isSigner(masa.config.signer)) {
      // sign
      const msg = Templates.loginTemplateNext(
        challengeData.challenge,
        challengeData.expires,
      );

      const address = await masa.config.signer.getAddress();

      if (masa.config.verbose) {
        console.info(`Signer Address: '${address}'`);
      }

      console.info(`Signing: \n'${msg}'\n`);
      const signature = await signMessage(msg, masa.config.signer);
      console.log(`Signature: '${signature}'`);

      if (signature) {
        const checkSignatureResponse = await masa.client.session.checkSignature(
          address,
          signature,
          challengeData.cookie,
        );

        if (checkSignatureResponse) {
          console.log("\nLogged in as:");
          console.log(`Address: '${address}'`);

          if (masa.config.verbose) {
            console.log(`User ID: '${checkSignatureResponse.userId}'`);
            console.log(
              `Session ID: '${unpackSessionId(challengeData.cookie)}'`,
            );
          }

          result = {
            success: true,
            address,
            userId: checkSignatureResponse.userId,
            cookie: challengeData.cookie,
          };
        }
      } else {
        result.message = "Creating signature failed!";
        console.error(result.message);
      }
    }
  } else {
    result.message =
      "Already logged in! Please logout before logging in again.";
    console.error(result.message);
  }

  return result;
};
