import {
  MasaSBT,
  MasaSBT__factory,
} from "@masa-finance/masa-contracts-identity";
import { BigNumber } from "ethers";

import { ContractFactory } from "../contracts";
import { MasaBase } from "../interface/masa-base";
import { MasaLinkable } from "../interface/masa-linkable";
import { burnSBT } from "./burn";
import { listSBTs } from "./list";

export class SBTWrapper<
  Contract extends MasaSBT
> extends MasaLinkable<Contract> {
  /**
   *
   * @param address
   */
  list = (address?: string) => listSBTs(this.masa, this.contract, address);

  /**
   *
   * @param SBTId
   */
  burn = (SBTId: BigNumber) => burnSBT(this.masa, this.contract, SBTId);
}

export class MasaSBTs extends MasaBase {
  /**
   *
   * @param address
   * @param factory
   */
  public connect = async (
    address: string,
    factory: ContractFactory = MasaSBT__factory
  ) => {
    const { sbtContract } =
      (await this.masa.contracts.sbt.connect(address, factory)) || {};

    return new SBTWrapper(this.masa, sbtContract);
  };
}
