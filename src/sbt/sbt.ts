import {
  MasaSBT as MasaSBTContract,
  MasaSBT__factory,
  ReferenceSBTAuthority,
  ReferenceSBTSelfSovereign,
} from "@masa-finance/masa-contracts-identity";
import { BigNumber } from "ethers";
import { MasaBase, MasaLinkable } from "../helpers";
import { ContractFactory } from "../contracts";
import { burnSBT, listSBTs } from "./";

export class SBTWrapper<
  Contract extends
    | ReferenceSBTAuthority
    | ReferenceSBTSelfSovereign
    | MasaSBTContract
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

export class MasaSBT<
  Contract extends
    | ReferenceSBTAuthority
    | ReferenceSBTSelfSovereign
    | MasaSBTContract
> extends MasaBase {
  /**
   *
   * @param address
   * @param factory
   */
  public async connect(
    address: string,
    factory: ContractFactory = MasaSBT__factory
  ) {
    const { sbtContract } =
      (await this.masa.contracts.sbt.connect<Contract>(address, factory)) || {};

    return new SBTWrapper<Contract>(this.masa, sbtContract);
  }
}
