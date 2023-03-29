import { isNativeCurrency, PaymentMethod } from "../../interface";
import { BigNumber } from "@ethersproject/bignumber";
import { ContractTransaction, TypedDataDomain, Wallet } from "ethers";
import { generateSignatureDomain, signTypedData } from "../../utils";
import { MasaModuleBase } from "./masa-module-base";

export class CreditScore extends MasaModuleBase {
  /**
   *
   */
  types = {
    MintCreditScore: [
      { name: "identityId", type: "uint256" },
      { name: "authorityAddress", type: "address" },
      { name: "signatureDate", type: "uint256" },
    ],
  };

  /**
   * gets the price for a credit score
   * @param paymentMethod
   * @param slippage
   */
  getPrice = async (
    paymentMethod: PaymentMethod,
    // slippage in bps where 10000 is 100%. 250 would be 2,5%
    slippage: number | undefined = 250
  ): Promise<{
    price: BigNumber;
    paymentAddress: string;
    formattedPrice: string;
  }> => {
    const paymentAddress = this.getPaymentAddress(paymentMethod);

    let price = await this.instances.SoulboundCreditScoreContract.getMintPrice(
      paymentAddress
    );

    if (slippage) {
      if (isNativeCurrency(paymentMethod)) {
        price = this.addSlippage(price, slippage);
      }
    }

    const formattedPrice = await this.formatPrice(paymentAddress, price);

    return {
      price,
      paymentAddress,
      formattedPrice,
    };
  };

  /**
   * purchase credit score
   * @param paymentMethod
   * @param identityId
   * @param authorityAddress
   * @param signatureDate
   * @param signature
   * @param slippage
   */
  mint = async (
    paymentMethod: PaymentMethod,
    identityId: BigNumber,
    authorityAddress: string,
    signatureDate: number,
    signature: string,
    slippage: number | undefined = 250
  ): Promise<ContractTransaction> => {
    const value: {
      identityId: BigNumber;
      authorityAddress: string;
      signatureDate: number;
    } = {
      identityId,
      authorityAddress,
      signatureDate,
    };

    const domain: TypedDataDomain = await generateSignatureDomain(
      this.masa.config.wallet as Wallet,
      "SoulboundCreditScore",
      this.instances.SoulboundCreditScoreContract.address
    );

    await this.verify(
      "Verifying credit score failed!",
      this.instances.SoulboundCreditScoreContract,
      domain,
      this.types,
      value,
      signature,
      authorityAddress
    );

    const { price, paymentAddress } = await this.getPrice(
      paymentMethod,
      slippage
    );

    await this.checkOrGiveAllowance(
      paymentAddress,
      paymentMethod,
      this.instances.SoulboundCreditScoreContract.address,
      price
    );

    const creditScoreMintParameters: [
      string,
      BigNumber,
      string,
      number,
      string
    ] = [
      paymentAddress,
      identityId,
      authorityAddress,
      signatureDate,
      signature,
    ];

    const creditScoreMintOverrides = {
      value: price,
    };

    if (this.masa.config.verbose) {
      console.log({ creditScoreMintParameters, creditScoreMintOverrides });
    }

    // connect
    const creditScoreContract =
      await this.instances.SoulboundCreditScoreContract.connect(
        this.masa.config.wallet
      );

    // estimate
    const gasLimit = await creditScoreContract.estimateGas[
      "mint(address,uint256,address,uint256,bytes)"
    ](...creditScoreMintParameters, creditScoreMintOverrides);

    // execute
    return creditScoreContract["mint(address,uint256,address,uint256,bytes)"](
      ...creditScoreMintParameters,
      { ...creditScoreMintOverrides, gasLimit }
    );
  };

  /**
   * Signs a credit score
   * @param identityId
   */
  sign = async (
    identityId: BigNumber
  ): Promise<
    | {
        signature: string;
        signatureDate: number;
        authorityAddress: string;
      }
    | undefined
  > => {
    const signatureDate = Math.floor(Date.now() / 1000);

    const authorityAddress = await this.masa.config.wallet.getAddress();
    const value: {
      identityId: BigNumber;
      authorityAddress: string;
      signatureDate: number;
    } = {
      identityId,
      authorityAddress,
      signatureDate,
    };

    const { signature, domain } = await signTypedData(
      this.instances.SoulboundCreditScoreContract,
      this.masa.config.wallet as Wallet,
      "SoulboundCreditScore",
      this.types,
      value
    );

    await this.verify(
      "Signing credit score failed!",
      this.instances.SoulboundCreditScoreContract,
      domain,
      this.types,
      value,
      signature,
      authorityAddress
    );

    return { signature, signatureDate, authorityAddress };
  };
}
