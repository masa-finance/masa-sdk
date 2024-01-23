import type { Signer } from "ethers";

export abstract class ContractFactory {
  public static connect: <Contract>(
    address: string,
    signerOrProvider: Signer,
  ) => Contract;
}
