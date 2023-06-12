import type { BigNumber } from "@ethersproject/bignumber";
import type { MasaSBTSelfSovereign } from "@masa-finance/masa-contracts-identity";
import type { TypedDataField } from "ethers";

import type { PaymentMethod } from "../../../../interface";
import { SBTContractWrapper } from "../SBT";

export interface SSSBTContractWrapper<Contract extends MasaSBTSelfSovereign>
  extends SBTContractWrapper<Contract> {
  /**
   *
   * @param name
   * @param types
   * @param value
   */
  sign: (
    name: string,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, string | BigNumber | number>
  ) => Promise<{
    signature: string;
    authorityAddress: string;
  }>;

  /**
   *
   * @param paymentMethod
   * @param name
   * @param types
   * @param value
   * @param signature
   * @param authorityAddress
   * @param slippage
   */
  prepareMint: (
    paymentMethod: PaymentMethod,
    name: string,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, string | BigNumber | number>,
    signature: string,
    authorityAddress: string,
    slippage?: number
  ) => Promise<{
    price: BigNumber;
    paymentAddress: string;
  }>;

  /**
   *
   * @param paymentMethod
   * @param receiver
   * @param signature
   * @param signatureDate
   * @param authorityAddress
   */
  mint: (
    paymentMethod: PaymentMethod,
    receiver: string,
    signature: string,
    signatureDate: number,
    authorityAddress: string
  ) => Promise<boolean>;
}
