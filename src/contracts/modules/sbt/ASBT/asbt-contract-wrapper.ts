import type { ReferenceSBTAuthority } from "@masa-finance/masa-contracts-identity";

import type { PaymentMethod } from "../../../../interface";
import type { SBTContractWrapper } from "../SBT";

export interface ASBTContractWrapper<Contract extends ReferenceSBTAuthority>
  extends SBTContractWrapper<Contract> {
  /**
   *
   * @param paymentMethod
   * @param receiver
   */
  mint: (paymentMethod: PaymentMethod, receiver: string) => Promise<boolean>;

  /**
   *
   * @param paymentMethod
   * @param receiver
   */
  bulkMint: (
    paymentMethod: PaymentMethod,
    receivers: string[]
  ) => Promise<boolean[]>;
}
