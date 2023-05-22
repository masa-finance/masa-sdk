import {
  MasaSBT as MasaSBTContract,
  MasaSBTSelfSovereign__factory,
  ReferenceSBTAuthority,
  ReferenceSBTSelfSovereign,
} from "@masa-finance/masa-contracts-identity";
import { BigNumber } from "ethers";
import { MasaBase } from "../helpers/masa-base";
import { ContractFactory } from "../contracts";
import { MasaSoulLinker } from "../soul-linker";
import { burnSBT, listSBTs } from "./";

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
    factory: ContractFactory = MasaSBTSelfSovereign__factory
  ) {
    const { sbtContract } =
      (await this.masa.contracts.sbt.connect<Contract>(address, factory)) || {};

    return {
      sbtContract,
      /**
       *
       */
      links: sbtContract
        ? new MasaSoulLinker(this.masa, sbtContract)
        : undefined,

      /**
       *
       * @param address
       */
      list: (address?: string) => {
        if (!sbtContract) return;
        return listSBTs(this.masa, sbtContract, address);
      },

      /**
       *
       * @param SBTId
       */
      burn: (SBTId: BigNumber) => {
        if (!sbtContract) return;
        return burnSBT(this.masa, sbtContract, SBTId);
      },
    };
  }
}
