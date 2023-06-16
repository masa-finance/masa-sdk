import { BigNumber } from "@ethersproject/bignumber";
import type {
  ContractTransaction,
  PayableOverrides,
  TypedDataDomain,
} from "ethers";

import { MasaSBTModuleBase } from "../../base";
import { Messages } from "../../collections";
import type { PaymentMethod, PriceInformation } from "../../interface";
import {
  generateSignatureDomain,
  isNativeCurrency,
  signTypedData,
} from "../../utils";

export class Green extends MasaSBTModuleBase {
  /**
   *
   */
  public readonly types = {
    MintGreen: [
      { name: "to", type: "address" },
      { name: "authorityAddress", type: "address" },
      { name: "signatureDate", type: "uint256" },
    ],
  };

  /**
   * Gets the price for a masa green
   * @param paymentMethod
   * @param slippage
   */
  public getPrice = async (
    paymentMethod: PaymentMethod,
    slippage: number | undefined = 250
  ): Promise<
    PriceInformation & {
      mintTransactionEstimatedGas: BigNumber;
      mintTransactionFee: BigNumber;
      formattedMintTransactionFee: string;
    }
  > => {
    const priceInformation = await this.getMintPrice(
      paymentMethod,
      this.instances.SoulboundGreenContract,
      slippage
    );

    const gasPrice = await this.masa.config.signer.getGasPrice();

    // hardcoded estimation for now
    const mintTransactionEstimatedGas = BigNumber.from(250_000);
    const mintTransactionFee = gasPrice.mul(mintTransactionEstimatedGas);

    const formattedMintTransactionFee: string = await this.formatPrice(
      priceInformation.paymentAddress,
      mintTransactionFee
    );

    return {
      ...priceInformation,
      mintTransactionEstimatedGas,
      mintTransactionFee,
      formattedMintTransactionFee,
    };
  };

  /**
   * Purchase a masa green
   * @param paymentMethod
   * @param receiver
   * @param authorityAddress
   * @param signatureDate
   * @param signature
   * @param slippage
   */
  public mint = async (
    paymentMethod: PaymentMethod,
    receiver: string,
    authorityAddress: string,
    signatureDate: number,
    signature: string,
    slippage: number | undefined = 250
  ): Promise<ContractTransaction> => {
    const value: {
      to: string;
      authorityAddress: string;
      signatureDate: number;
    } = {
      to: receiver,
      authorityAddress,
      signatureDate,
    };

    const domain: TypedDataDomain = await generateSignatureDomain(
      this.masa.config.signer,
      "SoulboundGreen",
      this.instances.SoulboundGreenContract.address
    );

    await this.verify(
      "Verifying green failed!",
      this.instances.SoulboundGreenContract,
      domain,
      this.types,
      value,
      signature,
      authorityAddress
    );

    const { paymentAddress, price, formattedPrice, mintTransactionFee } =
      await this.getPrice(paymentMethod, slippage);

    if (this.masa.config.verbose) {
      console.log({
        price: price.toString(),
        mintTransactionFee: mintTransactionFee.toString(),
        paymentAddress,
        formattedPrice,
      });
    }

    await this.checkOrGiveAllowance(
      paymentAddress,
      paymentMethod,
      this.instances.SoulboundGreenContract.address,
      price
    );

    const greenMintParameters: [string, string, string, number, string] = [
      paymentAddress,
      await this.masa.config.signer.getAddress(),
      authorityAddress,
      signatureDate,
      signature,
    ];

    const greenMintOverrides: PayableOverrides = await this.createOverrides(
      isNativeCurrency(paymentMethod) ? price : undefined
    );

    if (this.masa.config.verbose) {
      console.log({ greenMintParameters, greenMintOverrides });
    }

    // connect
    const {
      estimateGas: {
        "mint(address,address,address,uint256,bytes)": estimateGas,
      },
      "mint(address,address,address,uint256,bytes)": mint,
    } = await this.instances.SoulboundGreenContract.connect(
      this.masa.config.signer
    );

    // estimate gas
    let gasLimit: BigNumber = await estimateGas(
      ...greenMintParameters,
      greenMintOverrides
    );

    if (this.masa.config.network?.gasSlippagePercentage) {
      gasLimit = Green.addSlippage(
        gasLimit,
        this.masa.config.network.gasSlippagePercentage
      );
    }

    // execute
    return mint(...greenMintParameters, { ...greenMintOverrides, gasLimit });
  };

  /**
   * Signs a masa green
   * @param receiver
   */
  public sign = async (
    receiver: string
  ): Promise<
    | {
        signature: string;
        signatureDate: number;
        authorityAddress: string;
      }
    | undefined
  > => {
    const signatureDate = Math.floor(Date.now() / 1000);

    const authorityAddress = await this.masa.config.signer.getAddress();
    const value: {
      to: string;
      authorityAddress: string;
      signatureDate: number;
    } = {
      to: receiver,
      authorityAddress,
      signatureDate,
    };

    const { signature, domain } = await signTypedData(
      this.instances.SoulboundGreenContract,
      this.masa.config.signer,
      "SoulboundGreen",
      this.types,
      value
    );

    await this.verify(
      "Signing green failed!",
      this.instances.SoulboundGreenContract,
      domain,
      this.types,
      value,
      signature,
      authorityAddress
    );

    return { signature, signatureDate, authorityAddress };
  };

  /**
   *
   * @param greenId
   */
  public burn = async (greenId: BigNumber): Promise<boolean> => {
    try {
      console.log(`Burning Green with ID '${greenId}'!`);

      const {
        estimateGas: { burn: estimateGas },
        burn,
      } = this.masa.contracts.instances.SoulboundGreenContract.connect(
        this.masa.config.signer
      );

      let gasLimit: BigNumber = await estimateGas(greenId);

      if (this.masa.config.network?.gasSlippagePercentage) {
        gasLimit = Green.addSlippage(
          gasLimit,
          this.masa.config.network.gasSlippagePercentage
        );
      }
      const { wait, hash } = await burn(greenId, {
        gasLimit,
      });

      console.log(
        Messages.WaitingToFinalize(
          hash,
          this.masa.config.network?.blockExplorerUrls?.[0]
        )
      );

      await wait();

      console.log(`Burned Green with ID '${greenId}'!`);
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Burning Green Failed! '${error.message}'`);
      }
    }

    return false;
  };
}
