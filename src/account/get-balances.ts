import { addresses } from "../contracts";
import { IERC20__factory } from "@masa-finance/masa-contracts-identity";
import Masa from "../masa";
import { BigNumber, constants } from "ethers";

export const getBalances = async (masa: Masa, address?: string) => {
  if (!masa.config.wallet.provider) return;

  const contractAddresses = addresses[masa.config.network];
  const addressToLoad = address || (await masa.config.wallet.getAddress());

  const loadBalance = async (userAddress: string, tokenAddress?: string) => {
    const fallback = BigNumber.from(0);
    if (!masa.config.wallet.provider || !tokenAddress) return fallback;

    return IERC20__factory.connect(
      tokenAddress,
      masa.config.wallet.provider
    ).balanceOf(userAddress);
  };

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
    // ETH
    masa.config.wallet.provider.getBalance(addressToLoad),
    // MASA
    loadBalance(addressToLoad, contractAddresses.MASA),
    // USDC
    loadBalance(addressToLoad, contractAddresses.USDC),
    // WETH
    loadBalance(addressToLoad, contractAddresses.WETH),
    // SBI
    masa.contracts.instances.SoulboundIdentityContract.balanceOf(addressToLoad),
    // MSN
    masa.contracts.instances.SoulNameContract.balanceOf(addressToLoad),
    // SCS
    masa.contracts.instances.SoulboundCreditScoreContract.balanceOf(
      addressToLoad
    ),
    // 2FA
    masa.contracts.instances.Soulbound2FAContract.address !==
    constants.AddressZero
      ? masa.contracts.instances.Soulbound2FAContract.balanceOf(addressToLoad)
      : BigNumber.from(0),
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
