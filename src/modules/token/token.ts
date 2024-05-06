import { EndpointId } from "@layerzerolabs/lz-definitions";
import { SendParamStruct as SendParamStructMasaToken } from "@masa-finance/masa-token/dist/typechain/contracts/MasaToken";
import { SendParamStruct as SendParamStructMasaTokenNativeOFT } from "@masa-finance/masa-token/dist/typechain/contracts/MasaTokenNativeOFT";
import { SendParamStruct as SendParamStructMasaTokenOFT } from "@masa-finance/masa-token/dist/typechain/contracts/MasaTokenOFT";
import { BigNumber } from "ethers";

import { NetworkName } from "../../interface";
import { MasaBase } from "../../masa-base";
import { getSendParameters, getSendQuote, send } from "./bridge";
import { info, show, stake, unstake } from "./staking";
import { deposit, withdraw } from "./wrapping";

export class MasaToken extends MasaBase {
  // Bridge functions
  bridge = {
    /**
     * Get send parameters
     * @param eid
     * @param receiverAddress
     * @param tokenAmount
     * @param slippage
     */
    getSendParameters: (
      eid: EndpointId,
      receiverAddress: string,
      tokenAmount: BigNumber,
      slippage?: number,
    ) => getSendParameters(eid, receiverAddress, tokenAmount, slippage),

    /**
     * Get send quote
     * @param sendParameters
     */
    getSendQuote: (
      sendParameters:
        | SendParamStructMasaToken
        | SendParamStructMasaTokenNativeOFT
        | SendParamStructMasaTokenOFT,
    ) => getSendQuote(this.masa, sendParameters),

    /**
     * Send
     * @param to
     * @param amount
     * @param slippage
     */
    send: (to: NetworkName, amount: string, slippage?: number) =>
      send(this.masa, to, amount, slippage),
  };

  // wMASA function
  wrap = {
    /**
     * Deposit
     * @param amount
     */
    deposit: (amount: string) => deposit(this.masa, amount),

    /**
     * Withdraw
     * @param amount
     */
    withdraw: (amount: string) => withdraw(this.masa, amount),
  };

  // staking functions
  staking = {
    /**
     * Stake
     * @param amount
     * @param duration
     */
    stake: (amount: string, duration: number) =>
      stake(this.masa, amount, duration),

    /**
     * Unstake
     * @param index
     */
    unstake: (index: number) => unstake(this.masa, index),

    /**
     * Show stakes
     * @param address
     */
    show: (address?: string) => show(this.masa, address),

    /**
     * Show taking info
     */
    info: () => info(this.masa),
  };
}
