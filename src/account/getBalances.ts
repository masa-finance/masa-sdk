import { addresses } from "../contracts";
import { MASA__factory } from "@masa-finance/masa-contracts-identity";
import Masa from "../masa";

export const getBalances = async (masa: Masa, address: string) => {
  if (!masa.config.provider) return;

  const contractAddresses = addresses[masa.config.network];

  const [ethBalance, masaBalance, usdcBalance, wethBalance] = await Promise.all(
    [
      masa.config.provider.getBalance(address),
      MASA__factory.connect(
        contractAddresses.MASA,
        masa.config.provider
      ).balanceOf(address),
      MASA__factory.connect(
        contractAddresses.USDC,
        masa.config.provider
      ).balanceOf(address),
      MASA__factory.connect(
        contractAddresses.WETH,
        masa.config.provider
      ).balanceOf(address),
    ]
  );

  return {
    ethBalance,
    masaBalance,
    usdcBalance,
    wethBalance,
  };
};
