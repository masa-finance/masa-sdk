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
}

const loadContract = <T extends BaseContract & ContractInfo>({
  address,
  factory,
  signer,
}: {
  address?: string;
  factory: ContractFactory;
  signer: Signer;
}): T => {
  const addr = address ?? constants.AddressZero;

  let contract: T = factory.attach(addr) as T;

  contract.hasAddress = addr !== constants.AddressZero;

  if (contract.hasAddress) {
    contract = { ...contract, ...contract.connect(signer) } as T;
  }

  return contract;
};

export const loadIdentityContracts = ({
  signer,
  networkName = "ethereum",
}: LoadIdentityContractsArgs): IIdentityContracts => {
  // Identity
  const SoulboundIdentityContract = loadContract<
    SoulboundIdentity & ContractInfo
  >({
    factory: new SoulboundIdentity__factory(),
    address: addresses[networkName]?.SoulboundIdentityAddress,
    signer,
  });

  // Credit Score
  const SoulboundCreditScoreContract = loadContract<
    SoulboundCreditScore & ContractInfo
  >({
    factory: new SoulboundCreditScore__factory(),
    address: addresses[networkName]?.SoulboundCreditScoreAddress,
    signer,
  });

  // Soul Name
  const SoulNameContract = loadContract<SoulName & ContractInfo>({
    factory: new SoulName__factory(),
    address: addresses[networkName]?.SoulNameAddress,
    signer,
  });

  // Soul Linker
  const SoulLinkerContract = loadContract<SoulLinker & ContractInfo>({
    factory: new SoulLinker__factory(),
    address: addresses[networkName]?.SoulLinkerAddress,
    signer,
  });

  // Soul Store
  const SoulStoreContract = loadContract<SoulStore & ContractInfo>({
    factory: new SoulStore__factory(),
    address: addresses[networkName]?.SoulStoreAddress,
    signer,
  });

  // Green
  const SoulboundGreenContract = loadContract<SoulboundGreen & ContractInfo>({
    factory: new SoulboundGreen__factory(),
    address: addresses[networkName]?.SoulboundGreenAddress,
    signer,
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
