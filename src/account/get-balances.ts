import { addresses } from "../contracts";
import {
  IERC20__factory,
  SoulboundCreditScore,
  SoulboundGreen,
  SoulboundIdentity,
  SoulName,
} from "@masa-finance/masa-contracts-identity";
import Masa from "../masa";
import { BigNumber, ethers } from "ethers";

export const getBalances = async (
  masa: Masa,
  address?: string
): Promise<
  | {
      ethBalance: BigNumber;
      masaBalance: BigNumber;
      usdcBalance: BigNumber;
      wethBalance: BigNumber;
      identityBalance: BigNumber;
      soulNameBalance: BigNumber;
      soulboundCreditScoreBalance: BigNumber;
      soulboundGreenBalance: BigNumber;
    }
  | undefined
> => {
  if (!masa.config.wallet.provider) return;

  const contractAddresses = addresses[masa.config.network];
  const addressToLoad = address || (await masa.config.wallet.getAddress());

  const loadERC20Balance = async (
    userAddress: string,
    tokenAddress?: string
  ) => {
    let result = BigNumber.from(0);

    if (
      !masa.config.wallet.provider ||
      !tokenAddress ||
      tokenAddress === ethers.constants.AddressZero
    ) {
      return result;
    }

    try {
      const contract = IERC20__factory.connect(
        tokenAddress,
        masa.config.wallet.provider
      );

      result = await contract.balanceOf(userAddress);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Token: ${tokenAddress} Wallet Address: ${addressToLoad} ${error.message}`
        );
      }
    }

    return result;
  };

  const loadContractBalance = async (
    contract:
      | SoulboundIdentity
      | SoulName
      | SoulboundCreditScore
      | SoulboundGreen,
    addressToLoad: string
  ) => {
    let result = BigNumber.from(0);
    if (contract.address === ethers.constants.AddressZero) return result;

    try {
      result = await contract.balanceOf(addressToLoad);
    } catch (error: unknown) {
      if (error instanceof Error) {
        `Contract: ${contract.name} Wallet Address: ${addressToLoad} ${error.message}`;
      }
    }

    return result;
  };

  const [
    ethBalance,
    masaBalance,
    usdcBalance,
    wethBalance,
    identityBalance,
    soulNameBalance,
    soulboundCreditScoreBalance,
    soulboundGreenBalance,
  ] = await Promise.all([
    // ETH
    masa.config.wallet.provider.getBalance(addressToLoad),
    // MASA
    loadERC20Balance(addressToLoad, contractAddresses?.MASA),
    // USDC
    loadERC20Balance(addressToLoad, contractAddresses?.USDC),
    // WETH
    loadERC20Balance(addressToLoad, contractAddresses?.WETH),
    // SBI
    loadContractBalance(
      masa.contracts.instances.SoulboundIdentityContract,
      addressToLoad
    ),
    // MSN
    loadContractBalance(
      masa.contracts.instances.SoulNameContract,
      addressToLoad
    ),
    // SCS
    loadContractBalance(
      masa.contracts.instances.SoulboundCreditScoreContract,
      addressToLoad
    ),
    // Green
    loadContractBalance(
      masa.contracts.instances.SoulboundGreenContract,
      addressToLoad
    ),
  ]);

  const balances = {
    ethBalance,
    masaBalance,
    usdcBalance,
    wethBalance,
    identityBalance,
    soulNameBalance,
    soulboundCreditScoreBalance,
    soulboundGreenBalance,
  };

  return balances;
};
