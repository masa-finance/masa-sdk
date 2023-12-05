import type { BigNumber } from "ethers";

import { BaseErrorCodes, Templates } from "../../collections";
import type { BaseResult, MasaInterface } from "../../interface";
import { logger, signMessage, unpackSessionId } from "../../utils";

export interface LoginResult extends BaseResult {
  address?: string;
  userId?: BigNumber | string;
  cookie?: string;
}

export const login = async (masa: MasaInterface): Promise<LoginResult> => {
  logger("log", "Logging in");

  let result: LoginResult = {
    success: false,
    errorCode: BaseErrorCodes.UnknownError,
  };

  if (!(await masa.session.checkLogin())) {
    // get challenge
    const challengeData = await masa.client.session.getChallenge();

    if (challengeData) {
      // sign
      const msg = Templates.loginTemplate(
        challengeData.challenge,
        challengeData.expires,
      );

      const address = await masa.config.signer.getAddress();

      if (masa.config.verbose) {
        logger("info", `Signer Address: '${address}'`);
      }

      logger("info", `Signing: \n'${msg}'\n`);
      const signature = await signMessage(msg, masa.config.signer);
      logger("log", `Signature: '${signature}'`);

      if (signature) {
        const checkSignatureResponse = await masa.client.session.checkSignature(
          address,
          signature,
          challengeData.cookie,
        );

        if (checkSignatureResponse) {
          logger("log", "\nLogged in as:");
          logger("log", `Address: '${address}'`);

          if (masa.config.verbose) {
            logger("log", `User ID: '${checkSignatureResponse.userId}'`);
            logger(
              "log",
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
        logger("error", result);
      }
    }
  } else {
    result.message =
      "Already logged in! Please logout before logging in again.";
    logger("error", result);
  }

  return result;
};
