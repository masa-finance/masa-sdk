import {
  ReferenceSBTAuthority,
  ReferenceSBTAuthority__factory,
} from "@masa-finance/masa-contracts-identity";
import { deployASBT } from "./deploy";
import { mintASBT } from "./mint";
import { MasaSBT, SBTWrapper } from "../sbt";
import Masa from "../../masa";

export class ASBTWrapper<
  Contract extends ReferenceSBTAuthority
> extends SBTWrapper<Contract> {
  /**
   *
   * @param receiver
   */
  mint = (receiver: string) => mintASBT(this.masa, this.contract, receiver);
}

export class MasaASBT<
  Contract extends ReferenceSBTAuthority
> extends MasaSBT<Contract> {
  constructor(masa: Masa) {
    super(masa);

    this.connect.bind(this);
  }

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

  /**
   *
   * @param address
   */
  public async connect(address: string) {
    const { contract } = await super.connect(
      address,
      ReferenceSBTAuthority__factory
    );

    return new ASBTWrapper<Contract>(this.masa, contract);
  }
}
