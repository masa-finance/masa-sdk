import { Connection, Keypair } from "@solana/web3.js";
import { BaseContract, constants, ContractFactory, Signer } from "ethers";

import { type ContractInfo } from "../interface";
import { isSigner } from "../utils";

export const loadContract = <Contract extends BaseContract & ContractInfo>({
  address,
  factory,
  signer,
}: {
  address?: string;
  factory: ContractFactory;
  signer:
    | Signer
    | {
        keypair: Keypair;
        connection: Connection;
      };
}): Contract => {
  const addr = address ?? constants.AddressZero;
  const hasAddress = addr !== constants.AddressZero;

  let contract: Contract;

  contract = factory.attach(
    isSigner(signer) ? addr : constants.AddressZero,
  ) as Contract;

  if (isSigner(signer) && hasAddress) {
    contract = contract.connect(signer) as Contract;
  }

  contract.hasAddress = hasAddress;

  return contract;
};
