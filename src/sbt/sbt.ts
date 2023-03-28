import { MasaBase } from "../helpers/masa-base";
import { loadSBTContract } from "../contracts";
import {
  MasaSBTAuthority,
  MasaSBTSelfSovereign,
  MasaSBTSelfSovereign__factory,
} from "@masa-finance/masa-contracts-identity";
import { listSBTs } from "./list";
import { burnSBT } from "./burn";
import { BigNumber } from "ethers";
import { MasaSoulLinker } from "../soul-linker";

export class MasaSBT extends MasaBase {
  connect = async (address: string) => {
    const sbtContract: MasaSBTSelfSovereign | MasaSBTAuthority | undefined =
      await loadSBTContract(
        this.masa.config,
        address,
        MasaSBTSelfSovereign__factory
      );

    return {
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
  };
}
