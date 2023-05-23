import { ContractFactory, MasaModuleBase } from "./masa-module-base";
import {
  MasaSBT,
  MasaSBT__factory,
  MasaSBTAuthority,
  MasaSBTSelfSovereign,
} from "@masa-finance/masa-contracts-identity";
import { TypedDataDomain, TypedDataField } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import { generateSignatureDomain, signTypedData } from "../../utils";
import { PaymentMethod } from "../../interface";

interface ContractWrapper<
  Contract extends MasaSBTSelfSovereign | MasaSBTAuthority | MasaSBT
> {
  sbtContract: Contract;
  sign: (
    name: string,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, string | BigNumber | number>
  ) => Promise<{
    signature: string;
    authorityAddress: string;
  }>;
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
}

export class SBT extends MasaModuleBase {
  protected wrapper = <
    Contract extends MasaSBTSelfSovereign | MasaSBTAuthority | MasaSBT
  >(
    sbtContract: Contract
  ): ContractWrapper<Contract> => ({
    /**
     * instance of the SBT that this factory instance uses
     */
    sbtContract,

    /**
     * Signs an SBT based on its address
     * @param name
     * @param types
     * @param value
     */
    sign: async (
      name: string,
      types: Record<string, Array<TypedDataField>>,
      value: Record<string, string | BigNumber | number>
    ): Promise<{
      signature: string;
      authorityAddress: string;
    }> => {
      const authorityAddress = await this.masa.config.signer.getAddress();

      const { signature, domain } = await signTypedData(
        sbtContract,
        this.masa.config.signer,
        name,
        types,
        value
      );

      await this.verify(
        "Signing SBT failed!",
        sbtContract,
        domain,
        types,
        value,
        signature,
        authorityAddress
      );

      return { signature, authorityAddress };
    },

    /**
     *
     * @param paymentMethod
     * @param slippage
     */
    getPrice: async (
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
    prepareMint: async (
      paymentMethod: PaymentMethod,
      name: string,
      types: Record<string, Array<TypedDataField>>,
      value: Record<string, string | BigNumber | number>,
      signature: string,
      authorityAddress: string,
      slippage: number | undefined = 250
    ): Promise<{
      paymentAddress: string;
      price: BigNumber;
      formattedPrice: string;
      mintFee: BigNumber;
      formattedMintFee: string;
      protocolFee: BigNumber;
      formattedProtocolFee: string;
    }> => {
      const domain: TypedDataDomain = await generateSignatureDomain(
        this.masa.config.signer,
        name,
        sbtContract.address
      );

      await this.verify(
        "Verifying SBT failed!",
        sbtContract,
        domain,
        types,
        value,
        signature,
        authorityAddress
      );

      const { getPrice } = this.attach(sbtContract);
      const priceInfo = await getPrice(paymentMethod, slippage);

      if (this.masa.config.verbose) {
        console.info({ priceInfo });
      }

      return priceInfo;
    },
  });

  /**
   * loads an sbt instance and connects the contract functions to it
   * @param address
   * @param factory
   */
  connect = async <
    Contract extends MasaSBTSelfSovereign | MasaSBTAuthority | MasaSBT
  >(
    address: string,
    factory: ContractFactory = MasaSBT__factory
  ): Promise<ContractWrapper<Contract>> => {
    const sbtContract: Contract = await this.loadSBTContract(
      this.masa.config,
      address,
      factory
    );

    return this.wrapper<Contract>(sbtContract);
  };

  /**
   * attaches the contract function to an existing instances
   * @param contract
   */
  attach = <Contract extends MasaSBTSelfSovereign | MasaSBTAuthority | MasaSBT>(
    contract: Contract
  ): ContractWrapper<Contract> => {
    return this.wrapper<Contract>(contract);
  };
}
