import { BaseContract, constants, ContractFactory, Signer } from "ethers";

import { type ContractInfo } from "../interface";

export const loadContract = <T extends BaseContract & ContractInfo>({
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
