import { BigNumber } from "@ethersproject/bignumber";
import type {
  ContractTransaction,
  PayableOverrides,
  TypedDataDomain,
} from "ethers";

import { Messages } from "../../collections";
import type { PaymentMethod, PriceInformation } from "../../interface";
import {
  generateSignatureDomain,
  isNativeCurrency,
  signTypedData,
} from "../../utils";
import { MasaSBTModuleBase } from "./sbt/masa-sbt-module-base";

export class CreditScore extends MasaSBTModuleBase {
  /**
   *
   */
  public readonly types = {
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
  public getPrice = async (
    paymentMethod: PaymentMethod,
    // slippage in bps where 10000 is 100%. 250 would be 2,5%
    slippage: number | undefined = 250,
  ): Promise<PriceInformation> => {
    return await this.getMintPrice(
      paymentMethod,
      this.instances.SoulboundCreditScoreContract,
      slippage,
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
  public mint = async (
    paymentMethod: PaymentMethod,
    identityId: BigNumber,
    authorityAddress: string,
    signatureDate: number,
    signature: string,
    slippage: number | undefined = 250,
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
      this.instances.SoulboundCreditScoreContract.address,
    );

    await this.verify(
      "Verifying credit score failed!",
      this.instances.SoulboundCreditScoreContract,
      domain,
      this.types,
      value,
      signature,
      authorityAddress,
    );

    const { price, paymentAddress } = await this.getPrice(
      paymentMethod,
      slippage,
    );

    await this.checkOrGiveAllowance(
      paymentAddress,
      paymentMethod,
      this.instances.SoulboundCreditScoreContract.address,
      price,
    );

    const creditScoreMintOverrides: PayableOverrides =
      await this.createOverrides(
        isNativeCurrency(paymentMethod) ? price : undefined,
      );

    const creditScoreMintParametersIdentity: [
      string,
      BigNumber,
      string,
      number,
      string,
    ] = [
      paymentAddress,
      identityId,
      authorityAddress,
      signatureDate,
      signature,
    ];

    // connect
    const {
      estimateGas: {
        "mint(address,uint256,address,uint256,bytes)": estimateGas,
      },
      "mint(address,uint256,address,uint256,bytes)": mint,
    } = await this.instances.SoulboundCreditScoreContract;

    // estimate gas
    let gasLimit: BigNumber = await estimateGas(
      ...creditScoreMintParametersIdentity,
      creditScoreMintOverrides,
    );

    if (this.masa.config.network?.gasSlippagePercentage) {
      gasLimit = CreditScore.addSlippage(
        gasLimit,
        this.masa.config.network.gasSlippagePercentage,
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
      creditScoreMintOverridesWithGasLimit,
    );
  };

  /**
   * Signs a credit score
   * @param identityId
   */
  public sign = async (
    identityId: BigNumber,
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
      value,
    );

    await this.verify(
      "Signing credit score failed!",
      this.instances.SoulboundCreditScoreContract,
      domain,
      this.types,
      value,
      signature,
      authorityAddress,
    );

    return { signature, signatureDate, authorityAddress };
  };

  /**
   *
   * @param creditScoreId
   */
  public burn = async (creditScoreId: BigNumber): Promise<boolean> => {
    console.log(`Burning Credit Score with ID '${creditScoreId}'!`);

    try {
      const {
        estimateGas: { burn: estimateGas },
        burn,
      } = this.masa.contracts.instances.SoulboundCreditScoreContract;

      let gasLimit: BigNumber = await estimateGas(creditScoreId);
      if (this.masa.config.network?.gasSlippagePercentage) {
        gasLimit = CreditScore.addSlippage(
          gasLimit,
          this.masa.config.network.gasSlippagePercentage,
        );
      }

      const { wait, hash } = await burn(creditScoreId, {
        gasLimit,
      });

      console.log(
        Messages.WaitingToFinalize(
          hash,
          this.masa.config.network?.blockExplorerUrls?.[0],
        ),
      );

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
