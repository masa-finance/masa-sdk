import {
  MasaSBTAuthority,
  MasaSBTSelfSovereign,
  MasaSBTSelfSovereign__factory,
} from "@masa-finance/masa-contracts-identity";
import { BigNumber } from "ethers";
import { MasaBase } from "../helpers/masa-base";
import { loadSBTContract } from "../contracts";
import { MasaSoulLinker } from "../soul-linker";
import { burnSBT, deployASBT, listSBTs, mintASBT } from "./";

export class MasaSBT extends MasaBase {
  /**
   *
   * @param name
   * @param symbol
   * @param baseTokenUri
   * @param adminAddress
   */
  deployASBT = async (
    name: string,
    symbol: string,
    baseTokenUri: string,
    adminAddress?: string
  ) => deployASBT(this.masa, name, symbol, baseTokenUri, adminAddress);

  /**
   *
   * @param address
   */
  connect = async (address: string) => {
    const sbtContract: MasaSBTSelfSovereign | MasaSBTAuthority | undefined =
      await loadSBTContract(
        this.masa.config,
        address,
        MasaSBTSelfSovereign__factory
      );

    return {
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

      /**
       *
       * @param receiver
       */
      mintASBT: async (receiver: string) => {
        if (!sbtContract) return;
        return mintASBT(this.masa, sbtContract, receiver);
      },
    };
  };
}
