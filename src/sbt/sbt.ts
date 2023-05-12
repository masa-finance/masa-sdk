import {
  MasaSBTAuthority,
  MasaSBTSelfSovereign,
  MasaSBTSelfSovereign__factory,
} from "@masa-finance/masa-contracts-identity";
import { BigNumber } from "ethers";
import { MasaBase } from "../helpers/masa-base";
import { ContractFactory, loadSBTContract } from "../contracts";
import { MasaSoulLinker } from "../soul-linker";
import {
  burnSBT,
  deployASBT,
  deploySSSBT,
  listSBTs,
  mintASBT,
  mintSSSBT,
  signSSSBT,
} from "./";

export class MasaSBT extends MasaBase {
  ASBT = {
    /**
     *
     * @param name
     * @param symbol
     * @param baseTokenUri
     * @param adminAddress
     */
    deploy: async (
      name: string,
      symbol: string,
      baseTokenUri: string,
      adminAddress?: string
    ) => deployASBT(this.masa, name, symbol, baseTokenUri, adminAddress),

    /**
     *
     * @param contract
     * @param receiver
     */
    mint: async (contract: MasaSBTAuthority, receiver: string) => {
      return mintASBT(this.masa, contract as MasaSBTAuthority, receiver);
    },
  };

  SSSBT = {
    /**
     *
     * @param name
     * @param symbol
     * @param baseTokenUri
     * @param authorityAddress
     * @param adminAddress
     */
    deploy: async (
      name: string,
      symbol: string,
      baseTokenUri: string,
      authorityAddress: string,
      adminAddress?: string
    ) =>
      deploySSSBT(
        this.masa,
        name,
        symbol,
        baseTokenUri,
        authorityAddress,
        adminAddress
      ),

    /**
     *
     * @param contract
     * @param receiver
     */
    sign: async (contract: MasaSBTSelfSovereign, receiver: string) => {
      return signSSSBT(this.masa, contract, receiver);
    },

    /**
     *
     * @param contract
     * @param authorityAddress
     * @param signatureDate
     * @param signature
     */
    mint: async (
      contract: MasaSBTSelfSovereign,
      authorityAddress: string,
      signatureDate: number,
      signature: string
    ) => {
      return mintSSSBT(
        this.masa,
        contract,
        authorityAddress,
        signatureDate,
        signature
      );
    },
  };

  /**
   *
   * @param address
   * @param factory
   */
  connect = async <Contract extends MasaSBTSelfSovereign | MasaSBTAuthority>(
    address: string,
    factory: ContractFactory = MasaSBTSelfSovereign__factory
  ) => {
    const sbtContract: Contract | undefined = await loadSBTContract(
      this.masa.config,
      address,
      factory
    );

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
  };
}
