import { ReferenceSBTAuthority__factory } from "@masa-finance/masa-contracts-identity";

import { ContractFactory } from "../../../contracts";
import { MasaSBTs } from "../SBT";
import { ASBTWrapper } from "./asbt-wrapper";
import { deployASBT } from "./deploy";

export class MasaASBT extends MasaSBTs {
  /**
   *
   * @param name
   * @param symbol
   * @param baseTokenUri
   * @param limit
   * @param adminAddress
   */
  public deploy = ({
    name,
    symbol,
    baseTokenUri,
    limit = 1,
    adminAddress,
  }: {
    name: string;
    symbol: string;
    baseTokenUri: string;
    limit?: number;
    adminAddress?: string;
  }) =>
    deployASBT({
      masa: this.masa,
      name,
      symbol,
      baseTokenUri,
      limit,
      adminAddress,
    });

  /**
   *
   * @param address
   * @param factory
   */
  public connect = async (
    address: string,
    factory: ContractFactory = ReferenceSBTAuthority__factory
  ) => {
    const { sbtContract } = await this.masa.contracts.asbt.connect(
      address,
      factory
    );

    return new ASBTWrapper(this.masa, sbtContract);
  };
}
