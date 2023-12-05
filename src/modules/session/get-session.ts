import type { ISession, MasaInterface } from "../../interface";
import { logger } from "../../utils";

export const getSession = async (
  masa: MasaInterface,
): Promise<ISession | undefined> => {
  const session = await masa.client.session.check();

  if (session) {
    logger("log", `User: ${session.user}`);
    logger("log", `Signer Address: '${await masa.config.signer.getAddress()}'`);
    logger("log", "\n");
  }

  return session;
};
