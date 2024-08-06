import type { SoulboundIdentity } from "@masa-finance/masa-contracts-identity";

import type { MasaInterface } from "../../interface";
import { MasaLinkable } from "../masa-linkable";
import { burnIdentity } from "./burn";
import { loadIdentityByAddress } from "./load";
import { showIdentity } from "./show";

export class MasaIdentity extends MasaLinkable<SoulboundIdentity> {
  constructor(masa: MasaInterface) {
    super(masa, masa.contracts.instances.SoulboundIdentityContract);
  }

  load = (address?: string) => loadIdentityByAddress(this.masa, address);
  burn = () => burnIdentity(this.masa);
  show = (address?: string) => showIdentity(this.masa, address);
}
