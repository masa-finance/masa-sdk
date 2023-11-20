import type { MasaDynamicSSSBT } from "@masa-finance/masa-contracts-identity";

import type { PaymentMethod } from "../../../../interface";
import { MasaDynamicSBTWrapper } from "../masa-dynamic-sbt-wrapper";

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
  ): Promise<
    | {
        authorityAddress: string;
        signatureDate: number;
        signature: string;
      }
    | undefined
  > => {
    let result:
      | {
          authorityAddress: string;
          signatureDate: number;
          signature: string;
        }
      | undefined;

    const [name, symbol] = await Promise.all([
      this.contract.name(),
      this.contract.symbol(),
    ]);

    console.log(
      `Signing Set State for Dynamic SSSBT on: '${this.masa.config.networkName}'`,
    );
    console.log(`Contract Name: '${name}'`);
    console.log(`Contract Symbol: '${symbol}'`);
    console.log(`Contract Address: '${this.contract.address}'`);
    console.log(`State: '${state}': ${stateValue}`);
    console.log(`To receiver: '${receiver}'`);

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
      console.error(`State '${state}' already set on ${name} for ${receiver}`);
      return;
    }

    if (
      !possibleStates
        .map((state: string) => state.toLowerCase())
        .includes(state.toLowerCase())
    ) {
      console.error(`State '${state}' unknown to contract ${name}`);
      return;
    }

    // sign to create a signature
    const signResult = await signSetState(types, value);

    if (signResult) {
      const { signature, authorityAddress } = signResult;
      if (this.masa.config.verbose) {
        console.info({
          signature,
          authorityAddress,
          signatureDate,
        });
      }
      result = {
        authorityAddress,
        signatureDate,
        signature,
      };
    }

    return result;
  };

  /**
   *
   * @param paymentMethod
   */
  public mint = async (
    paymentMethod: PaymentMethod = "ETH",
  ): Promise<boolean> => {
    const receiver = await this.masa.config.signer.getAddress();

    const [name, symbol] = await Promise.all([
      this.contract.name(),
      this.contract.symbol(),
    ]);

    console.log(`Minting Dynamic SSSBT on: '${this.masa.config.networkName}'`);
    console.log(`Contract Name: '${name}'`);
    console.log(`Contract Symbol: '${symbol}'`);
    console.log(`Contract Address: '${this.contract.address}'`);
    console.log(`To receiver: '${receiver}'`);

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
  ): Promise<boolean> => {
    const receiver = await this.masa.config.signer.getAddress();

    const [name, symbol] = await Promise.all([
      this.contract.name(),
      this.contract.symbol(),
    ]);

    console.log(
      `Setting State for Dynamic SSSBT on: '${this.masa.config.networkName}'`,
    );
    console.log(`Contract Name: '${name}'`);
    console.log(`Contract Symbol: '${symbol}'`);
    console.log(`Contract Address: '${this.contract.address}'`);
    console.log(`State: '${state}': ${stateValue}`);
    console.log(`To receiver: '${receiver}'`);

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