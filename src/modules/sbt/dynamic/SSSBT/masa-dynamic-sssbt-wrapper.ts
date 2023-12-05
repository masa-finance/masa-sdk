import type { MasaDynamicSSSBT } from "@masa-finance/masa-contracts-identity";

import { BaseErrorCodes } from "../../../../collections";
import type {
  BaseResult,
  BaseResultWithTokenId,
  PaymentMethod,
} from "../../../../interface";
import { logger } from "../../../../utils";
import { MasaDynamicSBTWrapper } from "../masa-dynamic-sbt-wrapper";

type SignSetStateResult = BaseResult & {
  authorityAddress?: string;
  signatureDate?: number;
  signature?: string;
};

export class MasaDynamicSSSBTWrapper<
  Contract extends MasaDynamicSSSBT,
> extends MasaDynamicSBTWrapper<Contract> {
  /**
   *
   * @param receiver
   * @param state
   * @param stateValue
   */
  public signSetState = async (
    receiver: string,
    state: string,
    stateValue: boolean,
  ): Promise<SignSetStateResult> => {
    const result: SignSetStateResult = {
      success: false,
      errorCode: BaseErrorCodes.UnknownError,
    };

    const [name, symbol] = await Promise.all([
      this.contract.name(),
      this.contract.symbol(),
    ]);

    logger(
      "log",
      `Signing Set State for Dynamic SSSBT on: '${this.masa.config.networkName}'`,
    );
    logger("log", `Contract Name: '${name}'`);
    logger("log", `Contract Symbol: '${symbol}'`);
    logger("log", `Contract Address: '${this.contract.address}'`);
    logger("log", `State: '${state}': ${stateValue}`);
    logger("log", `To receiver: '${receiver}'`);

    const signatureDate = Date.now();

    // fill the collection with data
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
      authorityAddress: await this.masa.config.signer.getAddress(),
      signatureDate,
    };

    const { signSetState, types } = this.masa.contracts["dynamic-sssbt"].attach(
      this.contract,
    );

    const [possibleStates, stateAlreadySet] = await Promise.all([
      this.contract.getBeforeMintStates(),
      this.contract.beforeMintState(receiver, state),
    ]);

    if (stateAlreadySet) {
      result.message = `State '${state}' already set on ${name} for ${receiver}`;
      result.errorCode = BaseErrorCodes.AlreadyExists;
      logger("error", result);

      return result;
    }

    if (
      !possibleStates
        .map((state: string) => state.toLowerCase())
        .includes(state.toLowerCase())
    ) {
      result.message = `State '${state}' unknown to contract ${name}`;
      result.errorCode = BaseErrorCodes.DoesNotExist;
      logger("error", result);

      return result;
    }

    // sign to create a signature
    const signResult = await signSetState(types, value);

    if (signResult) {
      const { signature, authorityAddress } = signResult;

      if (this.masa.config.verbose) {
        logger("dir", {
          signature,
          authorityAddress,
          signatureDate,
        });
      }

      result.success = true;
      delete result.errorCode;
      result.authorityAddress = authorityAddress;
      result.signatureDate = signatureDate;
      result.signature = signature;
    }

    return result;
  };

  /**
   *
   * @param paymentMethod
   */
  public mint = async (
    paymentMethod: PaymentMethod = "ETH",
  ): Promise<BaseResultWithTokenId> => {
    const receiver = await this.masa.config.signer.getAddress();

    const [name, symbol] = await Promise.all([
      this.contract.name(),
      this.contract.symbol(),
    ]);

    logger(
      "log",
      `Minting Dynamic SSSBT on: '${this.masa.config.networkName}'`,
    );
    logger("log", `Contract Name: '${name}'`);
    logger("log", `Contract Symbol: '${symbol}'`);
    logger("log", `Contract Address: '${this.contract.address}'`);
    logger("log", `To receiver: '${receiver}'`);

    const { mint } = this.masa.contracts["dynamic-sssbt"].attach(this.contract);

    return mint(paymentMethod, receiver);
  };

  /**
   *
   * @param state
   * @param stateValue
   * @param signature
   * @param signatureDate
   * @param authorityAddress
   */
  public setState = async (
    state: string,
    stateValue: boolean,
    signature: string,
    signatureDate: number,
    authorityAddress: string,
  ): Promise<BaseResult> => {
    const receiver = await this.masa.config.signer.getAddress();

    const [name, symbol] = await Promise.all([
      this.contract.name(),
      this.contract.symbol(),
    ]);

    logger(
      "log",
      `Setting State for Dynamic SSSBT on: '${this.masa.config.networkName}'`,
    );
    logger("log", `Contract Name: '${name}'`);
    logger("log", `Contract Symbol: '${symbol}'`);
    logger("log", `Contract Address: '${this.contract.address}'`);
    logger("log", `State: '${state}': ${stateValue}`);
    logger("log", `To receiver: '${receiver}'`);

    const { setState } = this.masa.contracts["dynamic-sssbt"].attach(
      this.contract,
    );

    return setState(
      receiver,
      state,
      stateValue,
      signature,
      signatureDate,
      authorityAddress,
    );
  };
}
