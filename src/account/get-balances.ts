import { addresses } from "../contracts";
import { MASA__factory } from "@masa-finance/masa-contracts-identity";
import Masa from "../masa";

export const getBalances = async (masa: Masa, address: string) => {
  if (!masa.config.wallet.provider) return;

  const contractAddresses = addresses[masa.config.network];
  const signerAddress = masa.config.wallet.getAddress();

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
    masa.contracts.identity.SoulboundIdentityContract.balanceOf(signerAddress),
    masa.contracts.identity.SoulNameContract.balanceOf(signerAddress),
    masa.contracts.identity.SoulboundCreditReportContract.balanceOf(
      signerAddress
    ),
    masa.contracts.identity.Soulbound2FA.balanceOf(signerAddress),
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
