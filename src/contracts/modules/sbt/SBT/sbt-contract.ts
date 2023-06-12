import type { BigNumber } from "@ethersproject/bignumber";
import type { MasaSBT } from "@masa-finance/masa-contracts-identity";
import { MasaSBT__factory } from "@masa-finance/masa-contracts-identity";

import { MasaModuleBase } from "../../../../base";
import type { PaymentMethod } from "../../../../interface";
import type { ContractFactory } from "../../contract-factory";
import type { SBTContractWrapper } from "./sbt-contract-wrapper";

export class SBTContract<Contract extends MasaSBT> extends MasaModuleBase {
  /**
   *
   * @param sbtContract
   */
  public attach(sbtContract: Contract): SBTContractWrapper<Contract> {
    return {
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
    };
  }

  /**
   * loads an sbt instance and connects the contract functions to it
   * @param address
   * @param factory
   */
  public connect = async (
    address: string,
    factory: ContractFactory = MasaSBT__factory
  ): Promise<SBTContractWrapper<Contract>> => {
    const sbtContract: Contract = await SBTContract.loadSBTContract(
      this.masa.config,
      address,
      factory
    );

    return this.attach(sbtContract);
  };
}
