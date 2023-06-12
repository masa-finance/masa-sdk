import { MasaInterface } from "../interface";
import { Messages } from "../utils";

export const logout = async (
  masa: MasaInterface
): Promise<
  | {
      status: string;
    }
  | undefined
> => {
  console.log("Logging out");

  if (await masa.session.checkLogin()) {
    const logoutData = await masa.session.sessionLogout();

    if (logoutData) {
      console.log(`Logout: ${logoutData.status}`);

      return {
        status: logoutData.status,
      };
    }
  } else {
    console.error(Messages.NotLoggedIn());
  }
};
