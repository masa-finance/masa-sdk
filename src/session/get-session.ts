import { ISession, MasaInterface } from "../interface";

export const getSession = async (
  masa: MasaInterface
): Promise<ISession | undefined> => {
  const session = await masa.client.session.check();
  if (session) {
    console.log("User: ", session.user);
    console.log(`Signer Address: '${await masa.config.signer.getAddress()}'`);
    console.log("\n");

    return session;
  }
};
