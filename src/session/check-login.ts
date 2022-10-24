import Masa from "../masa";
import { unpackSessionId } from "../helpers/unpack-session-id";

export const checkLogin = async (masa: Masa): Promise<boolean> => {
  let loggedIn = false;

  const checkSessionResponse = await masa.client.sessionCheck();
  if (checkSessionResponse) {
    console.log(`User ID: '${checkSessionResponse.user.userId}'`);
    console.log(`Session ID: '${unpackSessionId(masa.config.cookie)}'`);
    console.log(
      `Signer Address: '${await masa.config.provider
        ?.getSigner()
        .getAddress()}'`
    );
    console.log("\n");

    loggedIn = true;
  }

  return loggedIn;
};
