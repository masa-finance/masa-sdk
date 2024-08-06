import type { ISession, MasaInterface } from "../../interface";
import { isSigner } from "../../utils";

export const getSession = async (
  masa: MasaInterface,
): Promise<ISession | undefined> => {
  const session = await masa.client.session.check();

  if (session && isSigner(masa.config.signer)) {
    console.log("User: ", session.user);
    console.log(`Signer Address: '${await masa.config.signer.getAddress()}'`);
    console.log("\n");
  }

  return session;
};
