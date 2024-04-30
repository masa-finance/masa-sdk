import { EndpointId } from "@layerzerolabs/lz-definitions";
import { SendParamStruct as SendParamStructMasaToken } from "@masa-finance/masa-token/dist/typechain/contracts/MasaToken";
import { SendParamStruct as SendParamStructMasaTokenNativeOFT } from "@masa-finance/masa-token/dist/typechain/contracts/MasaTokenNativeOFT";
import { SendParamStruct as SendParamStructMasaTokenOFT } from "@masa-finance/masa-token/dist/typechain/contracts/MasaTokenOFT";
import { BigNumber } from "ethers";

import { NetworkName } from "../../interface";
import { MasaBase } from "../../masa-base";
import { getSwapParameters, getSwapQuote, swap } from "./bridge/swap";
import { show } from "./staking";
import { stake } from "./staking/stake";
import { unstake } from "./staking/unstake";
import { deposit } from "./wrapping/deposit";
import { withdraw } from "./wrapping/withdraw";

export class MasaToken extends MasaBase {
  // Bridge functions
  /**
   * Get swap parameters
   * @param eid
   * @param receiverAddress
   * @param tokenAmount
   * @param slippage
   */
  getSwapParameters = (
    eid: EndpointId,
    receiverAddress: string,
    tokenAmount: BigNumber,
    slippage?: number,
  ) => getSwapParameters(eid, receiverAddress, tokenAmount, slippage);

  /**
   * Get swap quote
   * @param sendParameters
   */
  getSwapQuote = (
    sendParameters:
      | SendParamStructMasaToken
      | SendParamStructMasaTokenNativeOFT
      | SendParamStructMasaTokenOFT,
  ) => getSwapQuote(this.masa, sendParameters);

  /**
   * Swap
   * @param to
   * @param amount
   * @param slippage
   */
  swap = (to: NetworkName, amount: string, slippage?: number) =>
    swap(this.masa, to, amount, slippage);

  // wMASA function
  /**
   * Deposit
   * @param amount
   */
  deposit = (amount: string) => deposit(this.masa, amount);

  /**
   * Withdraw
   * @param amount
   */
  withdraw = (amount: string) => withdraw(this.masa, amount);

  // staking functions
  /**
   * Stake
   * @param amount
   * @param duration
   */
  stake = (amount: string, duration: number) =>
    stake(this.masa, amount, duration);

  /**
   * Unstake
   * @param index
   */
  unstake = (index: number) => unstake(this.masa, index);

  /**
   * Show stakes
   * @param address
   */
  show = (address?: string) => show(this.masa, address);
}
