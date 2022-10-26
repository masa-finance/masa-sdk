import Masa from "../masa";

export const logout = async (
  masa: Masa
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
    console.log("Not logged in please login first");
  }
};
