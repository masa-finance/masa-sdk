import { BaseContract, constants, ContractFactory, Signer } from "ethers";

import { type ContractInfo } from "../interface";

export const loadContract = <Contract extends BaseContract & ContractInfo>({
  address,
  factory,
  signer,
}: {
  address?: string;
  factory: ContractFactory;
  signer: Signer;
}): Contract => {
  const addr = address ?? constants.AddressZero;
  const hasAddress = addr !== constants.AddressZero;

  let contract: Contract;

  contract = factory.attach(addr) as Contract;

  if (hasAddress) {
    contract = contract.connect(signer) as Contract;
  }

  contract.hasAddress = hasAddress;

  return contract;
};
