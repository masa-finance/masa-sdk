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
import Masa from "../masa";

export class SBTWrapper<
  Contract extends
    | ReferenceSBTAuthority
    | ReferenceSBTSelfSovereign
    | MasaSBTContract
> extends MasaLinkable {
  constructor(protected masa: Masa, readonly sbtContract: Contract) {
    super(masa, sbtContract);
  }

  /**
   *
   * @param address
   */
  list(address?: string) {
    return listSBTs(this.masa, this.sbtContract, address);
  }

  /**
   *
   * @param SBTId
   */
  burn(SBTId: BigNumber) {
    return burnSBT(this.masa, this.sbtContract, SBTId);
  }
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
