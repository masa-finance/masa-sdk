import { BigNumber } from "@ethersproject/bignumber";
import type { MasaSBT } from "@masa-finance/masa-contracts-identity";
import { Signer, utils } from "ethers";

import type { PaymentMethod, PriceInformation } from "../../../interface";
import type { ContractFactory } from "../../../interface/contract-factory";
import { isNativeCurrency, logger } from "../../../utils";
import { MasaModuleBase } from "../masa-module-base";

const checkExists = async (
  address: string,
  signer: Signer,
): Promise<boolean> => {
  let result = true;

  const storage = await signer.provider?.getStorageAt(address, 0);

  // check if storage is 0x0 at position 0, this is the case most of the cases
  if (
    storage ===
    "0x0000000000000000000000000000000000000000000000000000000000000000"
  ) {
    // if the storage is empty, check if there is no code for this contract,
    // if so we can be sure it does not exist
    const code = await signer.provider?.getCode(address);
    if (code === "0x0") {
      // no contract in the blockchain dude
      result = false;
    }
  }

  return result;
};

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
    slippage: number | undefined = 250,
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
      protocolFee,
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
    factory: ContractFactory,
  ): Promise<Contract> => {
    let errorMessage = `Smart contract '${address}' does not exist on network '${this.masa.config.networkName}'!`;

    // address invalid, unable to load
    if (!utils.isAddress(address)) {
      errorMessage = `SBT Address '${address}' is not valid!`;
      logger("error", errorMessage);
      throw new Error(errorMessage);
    }

    const contractExists: boolean = await checkExists(
      address,
      this.masa.config.signer,
    );

    // no code exists, unable to load
    if (!contractExists) {
      throw new Error(errorMessage);
    }

    const contract = (factory as typeof ContractFactory).connect<Contract>(
      address,
      this.masa.config.signer,
    );

    // failed to load, unable to load
    if (!contract) {
      logger("error", errorMessage);
      throw new Error(errorMessage);
    } else if (this.masa.config.verbose) {
      logger("info", `Loaded contract with name: ${await contract.name()}`);
    }

    return contract;
  };
}
