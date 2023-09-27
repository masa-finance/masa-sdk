import type {
  SoulboundCreditScore,
  SoulboundGreen,
  SoulLinker,
  SoulName,
  SoulStore,
} from "@masa-finance/masa-contracts-identity";
import {
  SoulboundCreditScore__factory,
  SoulboundGreen__factory,
  SoulboundIdentity,
  SoulboundIdentity__factory,
  SoulLinker__factory,
  SoulName__factory,
  SoulStore__factory,
} from "@masa-finance/masa-contracts-identity";
import { BaseContract, constants, ContractFactory, Signer } from "ethers";

import type { ContractInfo, IIdentityContracts } from "../interface";
import { NetworkName } from "../interface";
import { addresses } from "../networks";

export interface LoadIdentityContractsArgs {
  signer: Signer;
  networkName?: NetworkName;
  skipLoadingContracts?: boolean;
}

const loadContract = <T extends BaseContract & ContractInfo>({
  factory,
  address,
  signer,
  skipLoadingContracts,
}: {
  factory: ContractFactory;
  address?: string;
  signer: Signer;
  skipLoadingContracts?: boolean;
}): T => {
  const addr = skipLoadingContracts
    ? constants.AddressZero
    : address ?? constants.AddressZero;

  let contract: T = factory.attach(addr) as T;

  contract.hasAddress = Boolean(addr) && addr !== constants.AddressZero;

  if (contract.hasAddress) {
    contract = { ...contract, ...contract.connect(signer) } as T;
  }
  return contract;
};

export const loadIdentityContracts = ({
  signer,
  networkName = "ethereum",
  skipLoadingContracts,
}: LoadIdentityContractsArgs): IIdentityContracts => {
  // Identity
  const SoulboundIdentityContract = loadContract<
    SoulboundIdentity & ContractInfo
  >({
    factory: new SoulboundIdentity__factory(),
    address: addresses[networkName]?.SoulboundIdentityAddress,
    signer,
    skipLoadingContracts,
  });

  // Credit Score
  const SoulboundCreditScoreContract = loadContract<
    SoulboundCreditScore & ContractInfo
  >({
    factory: new SoulboundCreditScore__factory(),
    address: addresses[networkName]?.SoulboundCreditScoreAddress,
    signer,
    skipLoadingContracts,
  });

  // Soul Name
  const SoulNameContract = loadContract<SoulName & ContractInfo>({
    factory: new SoulName__factory(),
    address: addresses[networkName]?.SoulNameAddress,
    signer,
    skipLoadingContracts,
  });

  // Soul Linker
  const SoulLinkerContract = loadContract<SoulLinker & ContractInfo>({
    factory: new SoulLinker__factory(),
    address: addresses[networkName]?.SoulLinkerAddress,
    signer,
    skipLoadingContracts,
  });

  // Soul Store
  const SoulStoreContract = loadContract<SoulStore & ContractInfo>({
    factory: new SoulStore__factory(),
    address: addresses[networkName]?.SoulStoreAddress,
    signer,
    skipLoadingContracts,
  });

  // Green
  const SoulboundGreenContract = loadContract<SoulboundGreen & ContractInfo>({
    factory: new SoulboundGreen__factory(),
    address: addresses[networkName]?.SoulboundGreenAddress,
    signer,
    skipLoadingContracts,
  });

  return {
    SoulboundIdentityContract,
    SoulboundCreditScoreContract,
    SoulNameContract,
    SoulLinkerContract,
    SoulStoreContract,
    SoulboundGreenContract,
  };
};
