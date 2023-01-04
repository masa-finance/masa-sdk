import Masa from "../masa";

export const checkAllowlist = async (masa: Masa): Promise<any> => {
  const checkAllowlistResponse = await masa.client.allowlistCheck();
  if (checkAllowlistResponse) {
    console.log(`Allowlist enabled: ${checkAllowlistResponse.isActive}`);
    console.log(`Allowlist enabled until: ${checkAllowlistResponse.endDate}`);

    console.log(`Signer Address: '${await masa.config.wallet.getAddress()}'`);
    console.log("\n");
    return checkAllowlistResponse;
  }

  return null;
};
