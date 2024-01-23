import { Messages } from "../../collections";
import type { MasaInterface } from "../../interface";
import { logger } from "../../utils";

export const logout = async (
  masa: MasaInterface,
): Promise<
  | {
      status: string;
    }
  | undefined
> => {
  let result;

  logger("log", "Logging out");

  if (await masa.session.checkLogin()) {
    const logoutData = await masa.session.sessionLogout();

    if (logoutData) {
      logger("log", `Logout: ${logoutData.status}`);

      result = {
        status: logoutData.status,
      };
    }
  } else {
    logger("error", Messages.NotLoggedIn());
  }

  return result;
};
