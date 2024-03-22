import { EndpointId } from "@layerzerolabs/lz-definitions";
import { SendParamStruct as SendParamStructMasaToken } from "@masa-finance/masa-token/dist/typechain/contracts/MasaToken";
import { SendParamStruct as SendParamStructMasaTokenNativeOFT } from "@masa-finance/masa-token/dist/typechain/contracts/MasaTokenNativeOFT";
import { SendParamStruct as SendParamStructMasaTokenOFT } from "@masa-finance/masa-token/dist/typechain/contracts/MasaTokenOFT";
import { BigNumber } from "ethers";

import { NetworkName } from "../../interface";
import { MasaBase } from "../../masa-base";
import { deposit } from "./deposit";
import { getSwapParameters, getSwapQuote, swap } from "./swap";
import { withdraw } from "./withdraw";

export class MasaToken extends MasaBase {
  // Swap functions
  getSwapParameters = (
    eid: EndpointId,
    receiverAddress: string,
    tokenAmount: BigNumber,
    slippage?: number,
  ) => getSwapParameters(eid, receiverAddress, tokenAmount, slippage);
  getSwapQuote = (
    sendParameters:
      | SendParamStructMasaToken
      | SendParamStructMasaTokenNativeOFT
      | SendParamStructMasaTokenOFT,
  ) => getSwapQuote(this.masa, sendParameters);
  swap = (to: NetworkName, amount: string, slippage?: number) =>
    swap(this.masa, to, amount, slippage);

  // ERC20 functions
  deposit = (amount: string) => deposit(this.masa, amount);
  withdraw = (amount: string) => withdraw(this.masa, amount);
}
