import Masa from "../masa";

export const getSession = async (masa: Masa): Promise<any> => {
  const checkSessionResponse = await masa.client.sessionCheck();
  if (checkSessionResponse) {
    console.log("User: ", checkSessionResponse.user);
    console.log(`Signer Address: '${await masa.config.wallet.getAddress()}'`);
    console.log("\n");

    return { session: checkSessionResponse };
  }

  return null;
};
