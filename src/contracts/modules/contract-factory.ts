import type { Signer } from "ethers";

export class ContractFactory {
  static connect: <Contract>(
    address: string,
    signerOrProvider: Signer
  ) => Contract;
}
