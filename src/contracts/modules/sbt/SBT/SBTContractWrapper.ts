import type { BigNumber } from "@ethersproject/bignumber";
import type { MasaSBT } from "@masa-finance/masa-contracts-identity";

import type { PaymentMethod } from "../../../../interface";

export interface SBTContractWrapper<Contract extends MasaSBT> {
  sbtContract: Contract;
  getPrice: (
    paymentMethod: PaymentMethod,
    slippage?: number
  ) => Promise<{
    paymentAddress: string;
    price: BigNumber;
    formattedPrice: string;
    mintFee: BigNumber;
    formattedMintFee: string;
    protocolFee: BigNumber;
    formattedProtocolFee: string;
  }>;
}
