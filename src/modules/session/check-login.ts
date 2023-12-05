import type { MasaInterface } from "../../interface";
import { logger } from "../../utils";

export const checkLogin = async (masa: MasaInterface): Promise<boolean> => {
  let loggedIn = false;

  const checkSessionResponse = await masa.client.session.check();
  if (checkSessionResponse) {
    logger("log", `User ID: '${checkSessionResponse.user.userId}'`);
    logger("log", `Signer Address: '${await masa.config.signer.getAddress()}'`);
    logger("log", `Network: '${masa.config.networkName}'`);
    logger("log", "\n");

    loggedIn = true;
  }

  return loggedIn;
};
