import { MasaModuleBase } from "./masa-module-base";
import {
  MasaSBTAuthority,
  MasaSBTSelfSovereign,
  MasaSBTSelfSovereign__factory,
} from "@masa-finance/masa-contracts-identity";
import { ContractFactory, loadSBTContract } from "../load-sbt-contract";
import { TypedDataDomain, TypedDataField, Wallet } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import { generateSignatureDomain, signTypedData } from "../../utils";
import { isNativeCurrency, PaymentMethod } from "../../interface";

export const isMasaSBTSelfSovereign = (
  contract: unknown
): contract is MasaSBTSelfSovereign =>
  !!(contract as MasaSBTSelfSovereign).getMintPrice;

export class SBT extends MasaModuleBase {
  protected wrapper = <
    Contract extends MasaSBTSelfSovereign | MasaSBTAuthority
  >(
    sbtContract?: Contract
  ): {
    sbtContract?: Contract;
    sign: (
      name: string,
      types: Record<string, Array<TypedDataField>>,
      value: Record<string, string | BigNumber | number>
    ) => Promise<
      | {
          signature: string;
          authorityAddress: string;
        }
      | undefined
    >;
    getPrice: (
      paymentMethod: PaymentMethod,
      slippage?: number
    ) => Promise<
      | {
          price: BigNumber;
          paymentAddress: string;
          formattedPrice: string;
        }
      | undefined
    >;
    prepareMint: (
      paymentMethod: PaymentMethod,
      name: string,
      types: Record<string, Array<TypedDataField>>,
      value: Record<string, string | BigNumber | number>,
      signature: string,
      authorityAddress: string,
      slippage?: number
    ) => Promise<
      | {
          price: BigNumber;
          paymentAddress: string;
        }
      | undefined
    >;
  } => ({
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
    ): Promise<
      | {
          signature: string;
          authorityAddress: string;
        }
      | undefined
    > => {
      if (!sbtContract) return;

      const authorityAddress = await this.masa.config.wallet.getAddress();

      const { signature, domain } = await signTypedData(
        sbtContract,
        this.masa.config.wallet as Wallet,
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

    getPrice: async (
      paymentMethod: PaymentMethod,
      slippage: number | undefined = 250
    ): Promise<
      | {
          price: BigNumber;
          paymentAddress: string;
          formattedPrice: string;
        }
      | undefined
    > => {
      if (!sbtContract || !isMasaSBTSelfSovereign(sbtContract)) return;

      const paymentAddress = this.getPaymentAddress(paymentMethod);

      let price = await sbtContract.getMintPrice(paymentAddress);

      if (slippage) {
        if (isNativeCurrency(paymentMethod)) {
          price = this.addSlippage(price, slippage);
        }
      }

      const formattedPrice: string = await this.formatPrice(
        paymentAddress,
        price
      );

      return {
        price,
        paymentAddress,
        formattedPrice,
      };
    },

    prepareMint: async (
      paymentMethod: PaymentMethod,
      name: string,
      types: Record<string, Array<TypedDataField>>,
      value: Record<string, string | BigNumber | number>,
      signature: string,
      authorityAddress: string,
      slippage: number | undefined = 250
    ): Promise<
      | {
          price: BigNumber;
          paymentAddress: string;
        }
      | undefined
    > => {
      if (!sbtContract) return;

      const domain: TypedDataDomain = await generateSignatureDomain(
        this.masa.config.wallet as Wallet,
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

      const { getPrice } = await this.attach(sbtContract);
      const priceObject = await getPrice(paymentMethod, slippage);

      if (!priceObject) return;

      if (this.masa.config.verbose) {
        console.log({
          price: priceObject.price.toString(),
          paymentAddress: priceObject.paymentAddress,
          formattedPrice: priceObject.formattedPrice,
        });
      }

      return {
        price: priceObject.price,
        paymentAddress: priceObject.paymentAddress,
      };
    },
  });

  /**
   * loads an sbt instance and connects the contract functions to it
   * @param address
   * @param factory
   */
  connect = async <Contract extends MasaSBTSelfSovereign | MasaSBTAuthority>(
    address: string,
    factory: ContractFactory = MasaSBTSelfSovereign__factory
  ) => {
    const sbtContract: Contract | undefined = await loadSBTContract(
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
  attach = <Contract extends MasaSBTSelfSovereign | MasaSBTAuthority>(
    contract: Contract
  ) => {
    return this.wrapper<Contract>(contract);
  };
}
