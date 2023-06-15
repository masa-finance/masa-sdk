import { LogDescription } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import { ReferenceSBTSelfSovereign } from "@masa-finance/masa-contracts-identity";
import type { TypedDataField } from "ethers";
import { PayableOverrides, TypedDataDomain } from "ethers";

import { Messages } from "../../../../collections";
import type { PaymentMethod } from "../../../../interface";
import {
  generateSignatureDomain,
  isNativeCurrency,
  signTypedData,
} from "../../../../utils";
import { SBTContractWrapper } from "../SBT";

export class SSSBTContractWrapper<
  Contract extends ReferenceSBTSelfSovereign
> extends SBTContractWrapper<Contract> {
  /**
   * Signs an SBT based on its address
   * @param name
   * @param types
   * @param value
   */
  sign = async (
    name: string,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, string | BigNumber | number>
  ): Promise<{
    signature: string;
    authorityAddress: string;
  }> => {
    const authorityAddress = await this.masa.config.signer.getAddress();

    const { signature, domain } = await signTypedData(
      this.contract,
      this.masa.config.signer,
      name,
      types,
      value
    );

    await this.verify(
      "Signing SBT failed!",
      this.contract,
      domain,
      types,
      value,
      signature,
      authorityAddress
    );

    return { signature, authorityAddress };
  };

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
  prepareMint = async (
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
      this.contract.address
    );

    await this.verify(
      "Verifying SBT failed!",
      this.contract,
      domain,
      types,
      value,
      signature,
      authorityAddress
    );

    const sssbtMintPriceInfo = await this.getPrice(paymentMethod, slippage);

    if (this.masa.config.verbose) {
      console.dir(
        {
          sssbtMintPriceInfo,
        },
        {
          depth: null,
        }
      );
    }

    return sssbtMintPriceInfo;
  };

  /**
   *
   * @param paymentMethod
   * @param receiver
   * @param signature
   * @param signatureDate
   * @param authorityAddress
   */
  mint = async (
    paymentMethod: PaymentMethod,
    receiver: string,
    signature: string,
    signatureDate: number,
    authorityAddress: string
  ): Promise<boolean> => {
    // current limit for SSSBT is 1 on the default installation
    let limit: number = 1;

    try {
      limit = (await this.contract.maxSBTToMint()).toNumber();
    } catch {
      if (this.masa.config.verbose) {
        console.info("Loading limit failed, falling back to 1!");
      }
    }

    try {
      const balance: BigNumber = await this.contract.balanceOf(receiver);

      if (limit > 0 && balance.gte(limit)) {
        console.error(
          `Minting of SSSBT failed: '${receiver}' exceeded the limit of '${limit}'!`
        );
        return false;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.warn(error.message);
      }
    }

    const types = {
      Mint: [
        { name: "to", type: "address" },
        { name: "authorityAddress", type: "address" },
        { name: "signatureDate", type: "uint256" },
      ],
    };

    // fill the collection with data
    const value: {
      to: string;
      authorityAddress: string;
      signatureDate: number;
    } = {
      to: receiver,
      authorityAddress,
      signatureDate,
    };

    const { price, paymentAddress } = await this.prepareMint(
      paymentMethod,
      "ReferenceSBTSelfSovereign",
      types,
      value,
      signature,
      authorityAddress
    );

    const mintSSSBTArguments: [
      string, // paymentMethod string
      string, // to string
      string, // authorityAddress string
      number, // authorityAddress number
      string // signature string
    ] = [paymentAddress, receiver, authorityAddress, signatureDate, signature];

    const feeData = await this.getNetworkFeeInformation();

    const mintSSSBTOverrides: PayableOverrides = {
      value: isNativeCurrency(paymentMethod) ? price : undefined,
      ...(feeData && feeData.maxPriorityFeePerGas
        ? {
            maxPriorityFeePerGas: BigNumber.from(feeData.maxPriorityFeePerGas),
          }
        : undefined),
      ...(feeData && feeData.maxFeePerGas
        ? {
            maxFeePerGas: BigNumber.from(feeData.maxFeePerGas),
          }
        : undefined),
    };

    if (this.masa.config.verbose) {
      console.dir(
        {
          mintSSSBTArguments,
          mintSSSBTOverrides,
        },
        {
          depth: null,
        }
      );
    }

    const {
      "mint(address,address,address,uint256,bytes)": mint,
      estimateGas: {
        "mint(address,address,address,uint256,bytes)": estimateGas,
      },
    } = this.contract;

    let gasLimit: BigNumber = await estimateGas(
      ...mintSSSBTArguments,
      mintSSSBTOverrides
    );

    if (this.masa.config.network?.gasSlippagePercentage) {
      gasLimit = SSSBTContractWrapper.addSlippage(
        gasLimit,
        this.masa.config.network.gasSlippagePercentage
      );
    }

    const { wait, hash } = await mint(...mintSSSBTArguments, {
      ...mintSSSBTOverrides,
      gasLimit,
    });

    console.log(
      Messages.WaitingToFinalize(
        hash,
        this.masa.config.network?.blockExplorerUrls?.[0]
      )
    );

    const { logs } = await wait();

    const parsedLogs = this.masa.contracts.parseLogs(logs, [this.contract]);

    const mintEvent = parsedLogs.find(
      (log: LogDescription) => log.name === "Mint"
    );

    if (mintEvent) {
      const { args } = mintEvent;
      console.log(
        `Minted to token with ID: ${args._tokenId} receiver '${args._owner}'`
      );

      return true;
    }

    return false;
  };
}
