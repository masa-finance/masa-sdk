import type { MasaSBT } from "@masa-finance/masa-contracts-identity";
import type { BigNumber } from "ethers";

import { MasaLinkable } from "../../base";
import { burnSBT } from "./burn";
import { listSBTs } from "./list";

export class SBTWrapper<
  Contract extends MasaSBT
> extends MasaLinkable<Contract> {
  /**
   *
   * @param address
   */
  list = (address?: string) => listSBTs(this.masa, this.contract, address);

  /**
   *
   * @param SBTId
   */
  burn = (SBTId: BigNumber) => burnSBT(this.masa, this.contract, SBTId);
}
