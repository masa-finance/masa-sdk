import { MasaBase } from "../helpers/masa-base";
import Masa from "../masa";
import { loadSBTContract } from "../contracts";
import {
  MasaSBTSelfSovereign,
  MasaSBTSelfSovereign__factory,
} from "@masa-finance/masa-contracts-identity";
import { listSBTs } from "./list";
import { burnSBT } from "./burn";
import { BigNumber } from "ethers";
import { MasaSoulLinker } from "../soul-linker";

export class MasaSBT extends MasaBase {
  constructor(masa: Masa) {
    super(masa);
  }

  connect = async (address: string) => {
    const selfSovereignSBT: MasaSBTSelfSovereign | undefined =
      await loadSBTContract(
        this.masa.config,
        address,
        MasaSBTSelfSovereign__factory
      );

    return {
      links: selfSovereignSBT
        ? new MasaSoulLinker(this.masa, selfSovereignSBT)
        : undefined,

      list: (address?: string) => {
        if (!selfSovereignSBT) return;
        return listSBTs(this.masa, selfSovereignSBT, address);
      },
      burn: (SBTId: BigNumber) => {
        if (!selfSovereignSBT) return;
        return burnSBT(this.masa, selfSovereignSBT, SBTId);
      },
    };
  };
}
