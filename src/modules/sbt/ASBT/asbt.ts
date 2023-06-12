import type { ReferenceSBTAuthority } from "@masa-finance/masa-contracts-identity";
import { ReferenceSBTAuthority__factory } from "@masa-finance/masa-contracts-identity";

import { MasaSBTs, SBTWrapper } from "../sbt";
import { deployASBT } from "./deploy";
import { mintASBT } from "./mint";

export class ASBTWrapper extends SBTWrapper<ReferenceSBTAuthority> {
  /**
   *
   * @param receiver
   */
  mint = (receiver: string) => mintASBT(this.masa, this.contract, receiver);
}

export class MasaASBT extends MasaSBTs {
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
  public connect = async (address: string) => {
    const { sbtContract } = await this.masa.contracts.asbt.connect(
      address,
      ReferenceSBTAuthority__factory
    );

    return new ASBTWrapper(this.masa, sbtContract);
  };
}
