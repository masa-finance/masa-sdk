import { BigNumber } from "@ethersproject/bignumber";
import { ContractTransaction, TypedDataDomain } from "ethers";

import { PaymentMethod } from "../../interface";
import {
  generateSignatureDomain,
  isNativeCurrency,
  Messages,
  signTypedData,
} from "../../utils";
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
    return await this.getMintPrice(
      paymentMethod,
      this.instances.SoulboundCreditScoreContract,
      slippage
    );
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
      this.masa.config.signer,
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

    // connect
    const {
      estimateGas: {
        "mint(address,uint256,address,uint256,bytes)": estimateGas,
      },
      "mint(address,uint256,address,uint256,bytes)": mint,
    } = await this.instances.SoulboundCreditScoreContract.connect(
      this.masa.config.signer
    );

    const creditScoreMintOverrides = {
      value: isNativeCurrency(paymentMethod) ? price : undefined,
    };

    const creditScoreMintParametersIdentity: [
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

    // estimate gas
    let gasLimit: BigNumber = await estimateGas(
      ...creditScoreMintParametersIdentity,
      creditScoreMintOverrides
    );

    if (this.masa.config.network?.gasSlippagePercentage) {
      gasLimit = CreditScore.addSlippage(
        gasLimit,
        this.masa.config.network.gasSlippagePercentage
      );
    }

    const creditScoreMintOverridesWithGasLimit = {
      ...creditScoreMintOverrides,
      gasLimit,
    };
    if (this.masa.config.verbose) {
      console.info({
        creditScoreMintParametersIdentity,
        creditScoreMintOverridesWithGasLimit,
      });
    }

    // execute
    return mint(
      ...creditScoreMintParametersIdentity,
      creditScoreMintOverridesWithGasLimit
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
    const authorityAddress = await this.masa.config.signer.getAddress();

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
      this.masa.config.signer,
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

  /**
   *
   * @param creditScoreId
   */
  burn = async (creditScoreId: BigNumber): Promise<boolean> => {
    console.log(`Burning Credit Score with ID '${creditScoreId}'!`);

    try {
      const {
        estimateGas: { burn: estimateGas },
        burn,
      } = this.masa.contracts.instances.SoulboundCreditScoreContract.connect(
        this.masa.config.signer
      );

      let gasLimit: BigNumber = await estimateGas(creditScoreId);
      if (this.masa.config.network?.gasSlippagePercentage) {
        gasLimit = CreditScore.addSlippage(
          gasLimit,
          this.masa.config.network.gasSlippagePercentage
        );
      }

      const { wait, hash } = await burn(creditScoreId, {
        gasLimit,
      });

      console.log(Messages.WaitingToFinalize(hash));
      await wait();

      console.log(`Burned Credit Score with ID '${creditScoreId}'!`);
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Burning Credit Score Failed! '${error.message}'`);
      }
    }

    return false;
  };
}
