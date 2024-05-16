import type { SoulboundGreen } from "@masa-finance/masa-contracts-identity";
import type { BigNumber } from "ethers";

import type { MasaInterface } from "../../interface";
import { MasaLinkable } from "../masa-linkable";
import { listGreens } from "./list";
import { loadGreens } from "./load";

export class MasaGreen extends MasaLinkable<SoulboundGreen> {
  constructor(masa: MasaInterface) {
    super(masa, masa.contracts.instances.SoulboundGreenContract);
  }

  /**
   * Burns a green
   * @param greenId
   */
  burn = (greenId: BigNumber) => this.masa.contracts.green.burn(greenId);

  /**
   * Lits all greens on the current network
   * @param address
   */
  list = (address?: string) => listGreens(this.masa, address);

  /**
   * Loads all greens for an identity on the current network
   * @param identityIdOrAddress
   */
  load = (identityIdOrAddress: BigNumber | string) =>
    loadGreens(this.masa, identityIdOrAddress);
}
