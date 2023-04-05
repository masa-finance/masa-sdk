import { Contract, ContractFactory } from "ethers";
import * as ASBT from "./contracts/ASBT";
import Masa from "../masa";

export const deployASBT = async (
  masa: Masa,
  name: string,
  symbol: string,
  baseTokenUri: string
): Promise<string> => {
  const factory: ContractFactory = new ContractFactory(
    ASBT.abi,
    ASBT.bytecode,
    masa.config.wallet
  );

  /**
   * address admin,
   * string memory name,
   * string memory symbol,
   * string memory baseTokenURI
   */
  const contract: Contract = await factory.deploy(
    // admin
    await masa.config.wallet.getAddress(),
    name,
    symbol,
    baseTokenUri
  );

  return contract.address;
};
