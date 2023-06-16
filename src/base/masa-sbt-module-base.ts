import { BigNumber } from "@ethersproject/bignumber";
import type { MasaSBT } from "@masa-finance/masa-contracts-identity";
import { utils } from "ethers";

import { ContractFactory } from "../contracts/modules/contract-factory";
import type { PaymentMethod, PriceInformation } from "../interface";
import { isNativeCurrency } from "../utils";
import { MasaModuleBase } from "./masa-module-base";

export abstract class MasaSBTModuleBase extends MasaModuleBase {
  /**
   *
   * @param paymentMethod
   * @param contract
   * @param slippage
   */
  protected getMintPrice = async (
    paymentMethod: PaymentMethod,
    contract: MasaSBT,
    // slippage in bps where 10000 is 100%. 250 would be 2,5%
    slippage: number | undefined = 250
  ): Promise<PriceInformation> => {
    const paymentAddress = this.getPaymentAddress(paymentMethod);

    let mintFee: BigNumber | undefined,
      protocolFee: BigNumber = BigNumber.from(0);

    try {
      // load protocol and mint fee
      const fees = await contract.getMintPriceWithProtocolFee(paymentAddress);
      mintFee = fees.price;
      protocolFee = fees.protocolFee;
    } catch {
      // ignore this is a soul store 2.0 function and does not work on older contracts
    }

    if (!mintFee) {
      // fallback to classical price calculation
      mintFee = await contract.getMintPrice(paymentAddress);
    }

    // calculate total price
    let price = mintFee.add(protocolFee);

    if (slippage) {
      if (isNativeCurrency(paymentMethod)) {
        price = MasaModuleBase.addSlippage(price, slippage);
      }
    }

    // total price
    const formattedPrice = await this.formatPrice(paymentAddress, price);

    // mint fee
    const formattedMintFee = await this.formatPrice(paymentAddress, mintFee);

    // protocol fee
    const formattedProtocolFee = await this.formatPrice(
      paymentAddress,
      protocolFee
    );

    return {
      paymentAddress,
      price,
      formattedPrice,
      mintFee,
      formattedMintFee,
      protocolFee,
      formattedProtocolFee,
    };
  };

  /**
   *
   * @param address
   * @param factory
   */
  protected loadSBTContract = async <Contract extends MasaSBT>(
    address: string,
    factory: ContractFactory
  ): Promise<Contract> => {
    let error = `Smart contract '${address}' does not exist on network '${this.masa.config.networkName}'!`;

    // address invalid, unable to load
    if (!utils.isAddress(address)) {
      error = `Address '${address}' is not valid!`;
      console.error(error);
      throw new Error(error);
    }
    // fetch code to see if the contract exists
    const code: string | undefined =
      await this.masa.config.signer.provider?.getCode(address);

    const contractExists: boolean = Boolean(code) && code !== "0x";

    // no code exists, unable to load
    if (!contractExists) {
      throw new Error(error);
    }

    const contract = (factory as typeof ContractFactory).connect<Contract>(
      address,
      this.masa.config.signer
    );

    // failed to load, unable to load
    if (!contract) {
      console.error(error);
      throw new Error(error);
    } else if (this.masa.config.verbose) {
      console.info(`Loaded contract with name: ${await contract.name()}`);
    }

    return contract;
  };
}
