import { MasaInterface } from "../interface/masa-interface";
import { Messages } from "../utils";

export const logout = async (
  masa: MasaInterface
): Promise<
  | {
      status: string;
    }
  | undefined
> => {
  let result;

  console.log("Logging out");

  if (await masa.session.checkLogin()) {
    const logoutData = await masa.session.sessionLogout();

    if (logoutData) {
      console.log(`Logout: ${logoutData.status}`);

      result = {
        status: logoutData.status,
      };
    }
  } else {
    console.error(Messages.NotLoggedIn());
  }

  return result;
};
