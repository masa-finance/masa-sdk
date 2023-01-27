import Masa from "../masa";
import { ISession } from "../interface";

export const getSession = async (masa: Masa): Promise<ISession | undefined> => {
  const session = await masa.client.session.check();
  if (session) {
    console.log("User: ", session.user);
    console.log(`Signer Address: '${await masa.config.wallet.getAddress()}'`);
    console.log("\n");

    return session;
  }
};
