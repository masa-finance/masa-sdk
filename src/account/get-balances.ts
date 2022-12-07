import { addresses } from "../contracts";
import { MASA__factory } from "@masa-finance/masa-contracts-identity";
import Masa from "../masa";

export const getBalances = async (masa: Masa, address?: string) => {
  if (!masa.config.wallet.provider) return;

  const contractAddresses = addresses[masa.config.network];
  const addressToLoad = address || (await masa.config.wallet.getAddress());

  const [
    ethBalance,
    masaBalance,
    usdcBalance,
    wethBalance,
    identityBalance,
    soulNameBalance,
    soulboundCreditScoreBalance,
    soulbound2FABalance,
  ] = await Promise.all([
    masa.config.wallet.provider.getBalance(addressToLoad),
    MASA__factory.connect(
      contractAddresses.MASA,
      masa.config.wallet.provider
    ).balanceOf(addressToLoad),
    MASA__factory.connect(
      contractAddresses.USDC,
      masa.config.wallet.provider
    ).balanceOf(addressToLoad),
    MASA__factory.connect(
      contractAddresses.WETH,
      masa.config.wallet.provider
    ).balanceOf(addressToLoad),
    masa.contracts.identity.SoulboundIdentityContract.balanceOf(addressToLoad),
    masa.contracts.identity.SoulNameContract.balanceOf(addressToLoad),
    masa.contracts.identity.SoulboundCreditScoreContract.balanceOf(
      addressToLoad
    ),
    masa.contracts.identity.Soulbound2FA.balanceOf(addressToLoad),
  ]);

  const balances = {
    ethBalance,
    masaBalance,
    usdcBalance,
    wethBalance,
    identityBalance,
    soulNameBalance,
    soulboundCreditScoreBalance,
    soulbound2FABalance,
  };

  return balances;
};
