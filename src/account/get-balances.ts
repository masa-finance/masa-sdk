import { addresses, PaymentMethod } from "../contracts";
import {
  IERC20__factory,
  SoulboundCreditScore,
  SoulboundGreen,
  SoulboundIdentity,
  SoulName,
} from "@masa-finance/masa-contracts-identity";
import Masa from "../masa";
import { BigNumber, constants } from "ethers";

type BalanceTypes = "Native" | PaymentMethod | SBTContractNames;

export type Balances = {
  [index in BalanceTypes]?: BigNumber;
};

type SBTContractNames = "Identity" | "SoulName" | "Green" | "CreditScore";

type SBTContracts =
  | SoulboundIdentity
  | SoulName
  | SoulboundCreditScore
  | SoulboundGreen;

export const getBalances = async (
  masa: Masa,
  address?: string
): Promise<Balances> => {
  const contractAddresses = addresses[masa.config.network];
  const addressToLoad = address || (await masa.config.wallet.getAddress());

  const loadERC20Balance = async (
    userAddress: string,
    tokenAddress?: string
  ): Promise<BigNumber | undefined> => {
    if (
      !masa.config.wallet.provider ||
      !tokenAddress ||
      tokenAddress === constants.AddressZero
    ) {
      return;
    }

    try {
      const contract = IERC20__factory.connect(
        tokenAddress,
        masa.config.wallet.provider
      );

      return await contract.balanceOf(userAddress);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Token: ${tokenAddress} Wallet Address: ${addressToLoad} ${error.message}`
        );
      }
    }
  };

  const loadContractBalance = async (
    contract: SBTContracts,
    addressToLoad: string
  ): Promise<BigNumber | undefined> => {
    if (contract.address === constants.AddressZero) return;

    try {
      return await contract.balanceOf(addressToLoad);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Contract: ${contract.name} Wallet Address: ${addressToLoad} ${error.message}`
        );
      }
    }
  };

  let ERC20Balances;

  if (contractAddresses?.tokens) {
    const paymentMethods = Object.keys(contractAddresses.tokens);
    ERC20Balances = await paymentMethods.reduce(
      async (
        accumulatedBalances: Promise<Partial<Balances>>,
        symbol: string
      ) => {
        const balance = await loadERC20Balance(
          addressToLoad,
          contractAddresses?.tokens?.[symbol as PaymentMethod]
        );

        const accumulated = await accumulatedBalances;
        return balance
          ? { ...accumulated, [symbol]: balance }
          : { ...accumulated };
      },
      Promise.resolve({})
    );
  }

  const Native: BigNumber | undefined =
    await masa.config.wallet.provider?.getBalance(addressToLoad);

  const SBTContractBalances: {
    [key in SBTContractNames]: SBTContracts;
  } = {
    Identity: masa.contracts.instances.SoulboundIdentityContract,
    SoulName: masa.contracts.instances.SoulNameContract,
    CreditScore: masa.contracts.instances.SoulboundCreditScoreContract,
    Green: masa.contracts.instances.SoulboundGreenContract,
  };

  const SBTBalances = await Object.keys(SBTContractBalances).reduce(
    async (accumulatedBalances: Promise<Partial<Balances>>, symbol: string) => {
      const balance = await loadContractBalance(
        SBTContractBalances[symbol as SBTContractNames],
        addressToLoad
      );
      const accumulated = await accumulatedBalances;

      return balance
        ? { ...accumulated, [symbol]: balance }
        : { ...accumulated };
    },
    Promise.resolve({})
  );

  return {
    Native,
    // ERC20
    ...ERC20Balances,
    // SBT
    ...SBTBalances,
  };
};
