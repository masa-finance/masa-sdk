import { LogDescription } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import { ReferenceSBTDynamicSelfSovereign } from "@masa-finance/masa-contracts-identity";
import type { TypedDataField } from "ethers";
import { PayableOverrides, TypedDataDomain } from "ethers";

import { Messages } from "../../../../../collections";
import type { PaymentMethod } from "../../../../../interface";
import {
  generateSignatureDomain,
  isNativeCurrency,
  signTypedData,
} from "../../../../../utils";
import { DynamicSBTContractWrapper } from "../dynamic-sbt-contract-wrapper";

export class DynamicSSSBTContractWrapper<
  Contract extends ReferenceSBTDynamicSelfSovereign,
> extends DynamicSBTContractWrapper<Contract> {
  public readonly types = {
    SetState: [
      { name: "account", type: "address" },
      { name: "state", type: "string" },
      { name: "value", type: "bool" },
      { name: "authorityAddress", type: "address" },
      { name: "signatureDate", type: "uint256" },
    ],
  };

  /**
   * Signs an SBT based on its address
   * @param name
   * @param types
   * @param value
   */
  public signState = async (
    name: string,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, string | BigNumber | number | boolean>,
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
      value,
    );

    await this.verify(
      "Signing Dynamic SBT failed!",
      this.contract,
      domain,
      types,
      value,
      signature,
      authorityAddress,
    );

    return { signature, authorityAddress };
  };

  /**
   *
   * @param name
   * @param types
   * @param value
   * @param signature
   * @param authorityAddress
   */
  protected prepareSetState = async (
    name: string,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, string | BigNumber | number | boolean>,
    signature: string,
    authorityAddress: string,
  ): Promise<boolean> => {
    const domain: TypedDataDomain = await generateSignatureDomain(
      this.masa.config.signer,
      name,
      this.contract.address,
    );

    await this.verify(
      "Verifying Dynamic SBT failed!",
      this.contract,
      domain,
      types,
      value,
      signature,
      authorityAddress,
    );

    return true;
  };

  /**
   *
   * @param receiver
   * @param state
   * @param stateValue
   * @param signature
   * @param signatureDate
   * @param authorityAddress
   */
  public setState = async (
    receiver: string,
    state: string,
    stateValue: boolean,
    signature: string,
    signatureDate: number,
    authorityAddress: string,
  ): Promise<boolean> => {
    const value: {
      account: string;
      state: string;
      value: boolean;
      authorityAddress: string;
      signatureDate: number;
    } = {
      account: receiver,
      state,
      value: stateValue,
      authorityAddress,
      signatureDate,
    };

    const {
      "setState(address,string,bool,address,uint256,bytes)": setState,
      estimateGas: {
        "setState(address,string,bool,address,uint256,bytes)": estimateGas,
      },
    } = this.contract;

    this.prepareSetState(
      "adsasdads",
      this.types,
      value,
      signature,
      authorityAddress,
    );

    const dynamicSSSBTSetStateArguments: [
      account: string,
      state: string,
      value: boolean,
      authorityAddress: string,
      signatureDate: number,
      signature: string,
    ] = [
      receiver,
      state,
      stateValue,
      authorityAddress,
      signatureDate,
      signature,
    ];

    const mintSSSBTOverrides: PayableOverrides = await this.createOverrides();

    let gasLimit: BigNumber = await estimateGas(
      ...dynamicSSSBTSetStateArguments,
      mintSSSBTOverrides,
    );

    if (this.masa.config.network?.gasSlippagePercentage) {
      gasLimit = DynamicSSSBTContractWrapper.addSlippage(
        gasLimit,
        this.masa.config.network.gasSlippagePercentage,
      );
    }

    const { wait, hash } = await setState(...dynamicSSSBTSetStateArguments, {
      ...mintSSSBTOverrides,
      gasLimit,
    });

    console.log(
      Messages.WaitingToFinalize(
        hash,
        this.masa.config.network?.blockExplorerUrls?.[0],
      ),
    );

    await wait();

    return true;
  };

  /**
   *
   * @param paymentMethod
   * @param receiver
   */
  public mint = async (
    paymentMethod: PaymentMethod,
    receiver: string,
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
          `Minting of SSSBT failed: '${receiver}' exceeded the limit of '${limit}'!`,
        );
        return false;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.warn(error.message);
      }
    }

    const { price, paymentAddress } = await this.getPrice(paymentMethod);

    const mintSSSBTArguments: [
      string, // paymentMethod string
    ] = [paymentAddress];

    const mintSSSBTOverrides: PayableOverrides = await this.createOverrides(
      isNativeCurrency(paymentMethod) ? price : undefined,
    );

    if (this.masa.config.verbose) {
      console.dir(
        {
          mintSSSBTArguments,
          mintSSSBTOverrides,
        },
        {
          depth: null,
        },
      );
    }

    const {
      "mint(address)": mint,
      estimateGas: { "mint(address)": estimateGas },
    } = this.contract;

    let gasLimit: BigNumber = await estimateGas(
      ...mintSSSBTArguments,
      mintSSSBTOverrides,
    );

    if (this.masa.config.network?.gasSlippagePercentage) {
      gasLimit = DynamicSSSBTContractWrapper.addSlippage(
        gasLimit,
        this.masa.config.network.gasSlippagePercentage,
      );
    }

    const { wait, hash } = await mint(...mintSSSBTArguments, {
      ...mintSSSBTOverrides,
      gasLimit,
    });

    console.log(
      Messages.WaitingToFinalize(
        hash,
        this.masa.config.network?.blockExplorerUrls?.[0],
      ),
    );

    const { logs } = await wait();

    const parsedLogs = this.masa.contracts.parseLogs(logs, [this.contract]);

    const mintEvent = parsedLogs.find(
      (log: LogDescription) => log.name === "Mint",
    );

    if (mintEvent) {
      const { args } = mintEvent;
      console.log(
        `Minted to token with ID: ${args._tokenId} receiver '${args._owner}'`,
      );

      return true;
    }

    return false;
  };
}
