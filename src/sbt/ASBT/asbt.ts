import {
  MasaSBTAuthority__factory,
  ReferenceSBTAuthority,
} from "@masa-finance/masa-contracts-identity";
import { deployASBT } from "./deploy";
import { mintASBT } from "./mint";
import { MasaSBT } from "../sbt";

export class MasaASBT<
  Contract extends ReferenceSBTAuthority
> extends MasaSBT<Contract> {
  /**
   *
   * @param name
   * @param symbol
   * @param baseTokenUri
   * @param adminAddress
   */
  public deploy = (
    name: string,
    symbol: string,
    baseTokenUri: string,
    adminAddress?: string
  ) => deployASBT(this.masa, name, symbol, baseTokenUri, adminAddress);

  public async connect(address: string) {
    const wrapper = await super.connect(address, MasaSBTAuthority__factory);

    return {
      ...wrapper,
      /**
       *
       * @param receiver
       */
      mint: async (receiver: string) => {
        if (wrapper.sbtContract) {
          return await mintASBT(this.masa, wrapper.sbtContract, receiver);
        }
      },
    };
  }
}
