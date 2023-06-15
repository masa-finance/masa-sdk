import type { ReferenceSBTAuthority } from "@masa-finance/masa-contracts-identity";

import { SBTWrapper } from "../SBT";
import { bulkMintASBT, mintASBT } from "./mint";

export class ASBTWrapper extends SBTWrapper<ReferenceSBTAuthority> {
  /**
   *
   * @param receiver
   */
  mint = (receiver: string) => mintASBT(this.masa, this.contract, receiver);

  /**
   *
   * @param receivers
   */
  bulkMint = (receivers: string[]) =>
    bulkMintASBT(this.masa, this.contract, receivers);
}
