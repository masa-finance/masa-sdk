import type { BigNumber } from "@ethersproject/bignumber";
import {
  MasaSBT,
  MasaSBT__factory,
} from "@masa-finance/masa-contracts-identity";

import type { PaymentMethod } from "../../../interface";
import { ContractFactory } from "../contract-factory";
import { MasaModuleBase } from "../masa-module-base";

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

export class SBT<Contract extends MasaSBT> extends MasaModuleBase {
  protected wrapper = (
    sbtContract: Contract
  ): SBTContractWrapper<Contract> => ({
    /**
     * instance of the SBT that this factory instance uses
     */
    sbtContract,

    /**
     *
     * @param paymentMethod
     * @param slippage
     */
    getPrice: (
      paymentMethod: PaymentMethod,
      slippage: number | undefined = 250
    ): Promise<{
      paymentAddress: string;
      price: BigNumber;
      formattedPrice: string;
      mintFee: BigNumber;
      formattedMintFee: string;
      protocolFee: BigNumber;
      formattedProtocolFee: string;
    }> => this.getMintPrice(paymentMethod, sbtContract, slippage),
  });

  /**
   * loads an sbt instance and connects the contract functions to it
   * @param address
   * @param factory
   */
  connect = async (
    address: string,
    factory: ContractFactory = MasaSBT__factory
  ): Promise<SBTContractWrapper<Contract>> => {
    const sbtContract: Contract = await SBT.loadSBTContract(
      this.masa.config,
      address,
      factory
    );

    return this.wrapper(sbtContract);
  };

  /**
   * attaches the contract function to an existing instances
   * @param sbtContract
   */
  attach = (sbtContract: Contract): SBTContractWrapper<Contract> => {
    return this.wrapper(sbtContract);
  };
}
