import {
  MasaSBTSelfSovereign__factory,
  ReferenceSBTSelfSovereign,
} from "@masa-finance/masa-contracts-identity";
import { deploySSSBT } from "./deploy";
import { signSSSBT } from "./sign";
import { mintSSSBT } from "./mint";
import { MasaSBT } from "../sbt";

export class MasaSSSBT<
  Contract extends ReferenceSBTSelfSovereign
> extends MasaSBT<Contract> {
  /**
   *
   * @param name
   * @param symbol
   * @param baseTokenUri
   * @param authorityAddress
   * @param adminAddress
   */
  deploy = (
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
    );

  public async connect(address: string) {
    const wrapper = await super.connect(address, MasaSBTSelfSovereign__factory);

    return {
      ...wrapper,
      /**
       *
       * @param receiver
       */
      sign: async (receiver: string) => {
        if (wrapper.sbtContract) {
          return await signSSSBT(this.masa, wrapper.sbtContract, receiver);
        }
      },

      /**
       *
       * @param authorityAddress
       * @param signatureDate
       * @param signature
       */
      mint: async (
        authorityAddress: string,
        signatureDate: number,
        signature: string
      ) => {
        if (wrapper.sbtContract) {
          return await mintSSSBT(
            this.masa,
            wrapper.sbtContract,
            authorityAddress,
            signatureDate,
            signature
          );
        }
      },
    };
  }
}
