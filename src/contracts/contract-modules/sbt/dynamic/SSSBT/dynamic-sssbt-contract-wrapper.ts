import { LogDescription } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import { MasaDynamicSSSBT } from "@masa-finance/masa-contracts-identity";
import type { TypedDataField } from "ethers";
import { PayableOverrides, TypedDataDomain } from "ethers";

import { Messages } from "../../../../../collections";
import type { BaseResult, PaymentMethod } from "../../../../../interface";
import {
  generateSignatureDomain,
  isNativeCurrency,
  isSigner,
  signTypedData,
} from "../../../../../utils";
import { DynamicSBTContractWrapper } from "../dynamic-sbt-contract-wrapper";

export class DynamicSSSBTContractWrapper<
  Contract extends MasaDynamicSSSBT,
> extends DynamicSBTContractWrapper<Contract> {
  /**
   *
   */
  public readonly types: Record<string, Array<TypedDataField>> = {
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
   * @param types
   * @param value
   */
  public signSetState = async (
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, string | BigNumber | number | boolean>,
  ): Promise<
    | {
        signature: string;
        authorityAddress: string;
      }
    | undefined
  > => {
    if (!isSigner(this.masa.config.signer)) {
      return;
    }

    const authorityAddress = await this.masa.config.signer.getAddress();

    const { signature, domain } = await signTypedData({
      contract: this.contract,
      signer: this.masa.config.signer,
      types,
      value,
    });

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
   * @param types
   * @param value
   * @param signature
   * @param authorityAddress
   */
  protected prepareSetState = async (
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, string | BigNumber | number | boolean>,
    signature: string,
    authorityAddress: string,
  ): Promise<BaseResult> => {
    const result: BaseResult = { success: false };

    if (!isSigner(this.masa.config.signer)) {
      result.message = "Unable to prepare set state!";
      return result;
    }

    const { name, version, verifyingContract } =
      await this.contract.eip712Domain();

    const domain: TypedDataDomain = await generateSignatureDomain(
      this.masa.config.signer,
      name,
      verifyingContract,
      version,
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

    result.success = true;

    return result;
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
  ): Promise<BaseResult> => {
    const result: BaseResult = { success: false };

    const [possibleStates, stateAlreadySet, name] = await Promise.all([
      this.contract.getBeforeMintStates(),
      this.contract.beforeMintState(receiver, state),
      this.contract.name(),
    ]);

    if (stateAlreadySet) {
      result.message = `State '${state}' already set on ${name} for ${receiver}`;
      console.error(result.message);
      return result;
    }

    if (
      !possibleStates
        .map((state: string) => state.toLowerCase())
        .includes(state.toLowerCase())
    ) {
      result.message = `State '${state}' unknown to contract ${name}`;
      console.error(result.message);
      return result;
    }

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

    await this.prepareSetState(this.types, value, signature, authorityAddress);

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

    try {
      const gasLimit = await this.estimateGasWithSlippage(
        estimateGas,
        dynamicSSSBTSetStateArguments,
        mintSSSBTOverrides,
      );

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
      result.success = true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        result.message = `Setting state failed! ${error.message}`;
        console.error(result.message);
      }
    }

    return result;
  };

  /**
   *
   * @param paymentMethod
   * @param receiver
   */
  public mint = async (
    paymentMethod: PaymentMethod,
    receiver: string,
  ): Promise<BaseResult> => {
    const result: BaseResult = { success: false };

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
        result.message = `Minting of SSSBT failed: '${receiver}' exceeded the limit of '${limit}'!`;
        console.error(result.message);
        return result;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.warn(`Unable to load balance ${error.message}`);
      }
    }

    const { price, paymentAddress } = await this.getPrice(paymentMethod);

    const mintSSSBTArguments: [
      string, // paymentMethod string
      string, // receiver string
    ] = [paymentAddress, receiver];

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
      "mint(address,address)": mint,
      estimateGas: { "mint(address,address)": estimateGas },
    } = this.contract;

    try {
      const gasLimit = await this.estimateGasWithSlippage(
        estimateGas,
        mintSSSBTArguments,
        mintSSSBTOverrides,
      );

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

        result.success = true;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        result.message = `Minting failed! ${error.message}`;
        console.error(result.message);
      }
    }

    return result;
  };
}
