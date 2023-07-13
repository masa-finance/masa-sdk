import type { Signer } from "ethers";

export abstract class ContractFactory {
  static connect: <Contract>(
    address: string,
    signerOrProvider: Signer,
  ) => Contract;
}
