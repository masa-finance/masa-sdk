import Masa from "../masa";

export const checkLogin = async (masa: Masa): Promise<boolean> => {
  let loggedIn = false;

  const checkSessionResponse = await masa.client.session.check();
  if (checkSessionResponse) {
    console.log(`User ID: '${checkSessionResponse.user.userId}'`);
    console.log(`Signer Address: '${await masa.config.signer.getAddress()}'`);
    console.log(`Network: '${masa.config.networkName}'`);
    console.log("\n");

    loggedIn = true;
  }

  return loggedIn;
};
