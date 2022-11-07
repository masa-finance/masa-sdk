import { addresses } from "../contracts";
import { MASA__factory } from "@masa-finance/masa-contracts-identity";
import Masa from "../masa";

export const getBalances = async (masa: Masa, address: string) => {
  if (!masa.config.wallet.provider) return;

  const contractAddresses = addresses[masa.config.network];

  const [ethBalance, masaBalance, usdcBalance, wethBalance] = await Promise.all(
    [
      masa.config.wallet.provider.getBalance(address),
      MASA__factory.connect(
        contractAddresses.MASA,
        masa.config.wallet.provider
      ).balanceOf(address),
      MASA__factory.connect(
        contractAddresses.USDC,
        masa.config.wallet.provider
      ).balanceOf(address),
      MASA__factory.connect(
        contractAddresses.WETH,
        masa.config.wallet.provider
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
