import {
  ReferenceSBTAuthority,
  ReferenceSBTAuthority__factory,
} from "@masa-finance/masa-contracts-identity";
import { deployASBT } from "./deploy";
import { mintASBT } from "./mint";
import { MasaSBT, SBTWrapper } from "../sbt";

export class ASBTWrapper<
  Contract extends ReferenceSBTAuthority
> extends SBTWrapper<Contract> {
  /**
   *
   * @param receiver
   */
  async mint(receiver: string) {
    return await mintASBT(this.masa, this.sbtContract, receiver);
  }
}

export class MasaASBT<
  Contract extends ReferenceSBTAuthority
> extends MasaSBT<Contract> {
  /**
   *
   * @param name
   * @param symbol
   * @param baseTokenUri
   * @param limit
   * @param adminAddress
   */
  public deploy = (
    name: string,
    symbol: string,
    baseTokenUri: string,
    limit: number = 1,
    adminAddress?: string
  ) => deployASBT(this.masa, name, symbol, baseTokenUri, limit, adminAddress);

  public async connect(address: string) {
    const wrapper = await super.connect(
      address,
      ReferenceSBTAuthority__factory
    );

    return new ASBTWrapper<Contract>(this.masa, wrapper.sbtContract);
  }
}
