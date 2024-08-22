import type { MasaInterface } from "../../interface";
import { isSigner } from "../../utils";

export const checkLogin = async (masa: MasaInterface): Promise<boolean> => {
  let loggedIn = false;

  const checkSessionResponse = await masa.client.session.check();
  if (checkSessionResponse && isSigner(masa.config.signer)) {
    console.log(`User ID: '${checkSessionResponse.user.userId}'`);
    console.log(`Signer Address: '${await masa.config.signer.getAddress()}'`);
    console.log(`Network: '${masa.config.networkName}'`);
    console.log("\n");

    loggedIn = true;
  }

  return loggedIn;
};
