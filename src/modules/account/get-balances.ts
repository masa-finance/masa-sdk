import type {
  SoulboundCreditScore,
  SoulboundGreen,
  SoulboundIdentity,
  SoulName,
} from "@masa-finance/masa-contracts-identity";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { constants, utils } from "ethers";

import type {
  ContractInfo,
  MasaInterface,
  PaymentMethod,
} from "../../interface";
import type { ERC20 } from "../../stubs";
import { ERC20__factory } from "../../stubs";
import { isSigner } from "../../utils";

export type BalanceTypes = "Native" | PaymentMethod | SBTContractNames;

export type Balances = Partial<{
  [index in BalanceTypes]: number | undefined;
}>;

export type SBTContractNames =
  | "Identity"
  | "SoulName"
  | "Green"
  | "CreditScore";

type SBTContracts =
  | SoulboundIdentity
  | SoulName
  | SoulboundCreditScore
  | SoulboundGreen;

export const getBalances = async (
  masa: MasaInterface,
  address?: string,
): Promise<Balances> => {
  const addressToLoad: string =
    address ||
    (isSigner(masa.config.signer)
      ? await masa.config.signer.getAddress()
      : masa.config.signer.keypair.publicKey.toBase58());

  if (!isSigner(masa.config.signer)) {
    // solana way

    const loadSPLBalance = async (
      userAddress: string,
      tokenAddress?: string,
    ): Promise<number | undefined> => {
      let splBalance;

      if (!isSigner(masa.config.signer) && tokenAddress) {
        try {
          splBalance = 0;

          const { value: tokenAccounts } =
            await masa.config.signer.connection.getTokenAccountsByOwner(
              new PublicKey(userAddress),
              {
                mint: new PublicKey(tokenAddress),
              },
            );

          if (tokenAccounts.length > 0) {
            const { value: tokenBalance } =
              await masa.config.signer.connection.getTokenAccountBalance(
                new PublicKey(tokenAccounts[0].pubkey),
              );

            if (tokenBalance.uiAmount) {
              splBalance = tokenBalance.uiAmount;
            }
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error(
              `Getting balance failed!: Token: ${tokenAddress} Wallet Address: ${userAddress} ${error.message}`,
            );
          }
        }
      }

      return splBalance;
    };

    const nativeBalance =
      (await masa.config.signer.connection.getBalance(
        masa.config.signer.keypair.publicKey,
      )) / LAMPORTS_PER_SOL;

    let SPLBalances;

    if (masa.config.network?.addresses?.tokens) {
      const tokens = Object.keys(masa.config.network.addresses.tokens);

      SPLBalances = await tokens.reduce(
        async (
          accumulatedBalances: Promise<Partial<Balances>>,
          symbol: string,
        ): Promise<Balances> => {
          const balance = await loadSPLBalance(
            addressToLoad,
            masa.config.network?.addresses?.tokens?.[symbol as PaymentMethod],
          );

          const accumulated = await accumulatedBalances;
          return balance !== undefined
            ? { ...accumulated, [symbol]: balance }
            : { ...accumulated };
        },
        Promise.resolve({}),
      );
    }

    return {
      Native: nativeBalance,
      ...SPLBalances,
    };
  }

  const loadERC20Balance = async (
    userAddress: string,
    tokenAddress?: string,
  ): Promise<number | undefined> => {
    let result;

    if (
      isSigner(masa.config.signer) &&
      tokenAddress &&
      tokenAddress !== constants.AddressZero
    ) {
      try {
        const contract: ERC20 = ERC20__factory.connect(
          tokenAddress,
          masa.config.signer,
        );

        const [balance, decimals] = await Promise.all([
          contract.balanceOf(userAddress),
          contract.decimals(),
        ]);

        result = parseFloat(utils.formatUnits(balance, decimals));
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(
            `Token: ${tokenAddress} Wallet Address: ${addressToLoad} ${error.message}`,
          );
        }
      }
    }

    return result;
  };

  const loadSBTContractBalance = async (
    contract: SBTContracts & ContractInfo,
    addressToLoad: string,
  ): Promise<number | undefined> => {
    let result;

    if (contract.hasAddress) {
      try {
        result = (await contract.balanceOf(addressToLoad)).toNumber();
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(
            `Contract: ${await contract
              .name()
              .catch(
                () => contract.address,
              )} Wallet Address: ${addressToLoad} ${error.message}`,
          );
        }
      }
    }

    return result;
  };

  let ERC20Balances;

  if (masa.config.network?.addresses?.tokens) {
    const paymentMethods = Object.keys(masa.config.network.addresses.tokens);
    ERC20Balances = await paymentMethods.reduce(
      async (
        accumulatedBalances: Promise<Partial<Balances>>,
        symbol: string,
      ): Promise<Balances> => {
        const balance = await loadERC20Balance(
          addressToLoad,
          masa.config.network?.addresses?.tokens?.[symbol as PaymentMethod],
        );

        const accumulated = await accumulatedBalances;
        return balance !== undefined
          ? { ...accumulated, [symbol]: balance }
          : { ...accumulated };
      },
      Promise.resolve({}),
    );
  }

  const nativeBalance =
    await masa.config.signer.provider?.getBalance(addressToLoad);

  const Native: number | undefined = nativeBalance
    ? parseFloat(utils.formatEther(nativeBalance))
    : undefined;

  const SBTContractBalances: {
    [key in SBTContractNames]: SBTContracts & ContractInfo;
  } = {
    Identity: masa.contracts.instances.SoulboundIdentityContract,
    SoulName: masa.contracts.instances.SoulNameContract,
    CreditScore: masa.contracts.instances.SoulboundCreditScoreContract,
    Green: masa.contracts.instances.SoulboundGreenContract,
  };

  const SBTBalances: Balances = await Object.keys(SBTContractBalances).reduce(
    async (
      accumulatedBalances: Promise<Partial<Balances>>,
      symbol: string,
    ): Promise<Balances> => {
      const balance = await loadSBTContractBalance(
        SBTContractBalances[symbol as SBTContractNames],
        addressToLoad,
      );
      const accumulated = await accumulatedBalances;

      return balance !== undefined
        ? { ...accumulated, [symbol]: balance }
        : { ...accumulated };
    },
    Promise.resolve({}),
  );

  return {
    Native,
    // ERC20
    ...ERC20Balances,
    // SBT
    ...SBTBalances,
  };
};
