import { EndpointId } from "@layerzerolabs/lz-definitions";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import {
  MasaToken,
  MasaToken__factory,
  MasaTokenNativeOFT,
  MasaTokenNativeOFT__factory,
  MasaTokenOFT,
  MasaTokenOFT__factory,
} from "@masa-finance/masa-token/dist/typechain";
import { SendParamStruct as SendParamStructMasaToken } from "@masa-finance/masa-token/dist/typechain/contracts/MasaToken";
import { SendParamStruct as SendParamStructMasaTokenNativeOFT } from "@masa-finance/masa-token/dist/typechain/contracts/MasaTokenNativeOFT";
import { SendParamStruct as SendParamStructMasaTokenOFT } from "@masa-finance/masa-token/dist/typechain/contracts/MasaTokenOFT";
import { BigNumber, constants, utils } from "ethers";

import { Messages, SupportedNetworks } from "../../collections";
import { BaseResult, MasaInterface, NetworkName } from "../../interface";

const lzUrl = (txHash: string, testnet: boolean = false) =>
  `https://${testnet ? "testnet." : ""}layerzeroscan.com/tx/${txHash}`;

/**
 *
 * @param masa
 */
export const loadOFTContract = (
  masa: MasaInterface,
): MasaToken | MasaTokenOFT | MasaTokenNativeOFT | undefined => {
  if (!masa.config.network?.addresses.tokens?.MASA) return;

  // origin
  let oft: MasaToken | MasaTokenOFT | MasaTokenNativeOFT | undefined;

  if (
    masa.config.networkName === "ethereum" ||
    masa.config.networkName === "sepolia"
  ) {
    oft = MasaToken__factory.connect(
      masa.config.network.addresses.tokens.MASA,
      masa.config.signer,
    );
  } else if (
    masa.config.networkName === "masa" ||
    masa.config.networkName === "masatest"
  ) {
    oft = MasaTokenNativeOFT__factory.connect(
      masa.config.network.addresses.tokens.MASA,
      masa.config.signer,
    );
  } else {
    oft = MasaTokenOFT__factory.connect(
      masa.config.network.addresses.tokens.MASA,
      masa.config.signer,
    );
  }

  return oft;
};

export interface QuoteResult extends BaseResult {
  nativeFee: BigNumber;
  lzTokenFee: BigNumber;
  gasLimit: BigNumber;
  transactionCost: BigNumber;
}

/**
 *
 * @param masa
 * @param sendParameters
 */
export const getSwapQuote = async (
  masa: MasaInterface,
  sendParameters:
    | SendParamStructMasaToken
    | SendParamStructMasaTokenNativeOFT
    | SendParamStructMasaTokenOFT,
): Promise<BaseResult | QuoteResult> => {
  let result: BaseResult | QuoteResult = {
    success: false,
  };

  const oft = loadOFTContract(masa);

  if (!oft) {
    result.message = "Unable to load OFT!";
    console.error(result);
    return result;
  }

  try {
    const {
      quoteSend,
      estimateGas: { send },
    } = oft;

    const { nativeFee, lzTokenFee } = await quoteSend(sendParameters, false);

    let gasPrice: BigNumber | undefined;

    try {
      const feeData = await masa.config.signer.getFeeData();
      if (feeData.maxPriorityFeePerGas) {
        gasPrice = feeData.maxPriorityFeePerGas;
      }
    } catch {
      console.warn(
        "Failed to get network fee information, falling back to gas price!",
      );
    }

    if (!gasPrice) {
      gasPrice = await masa.config.signer.getGasPrice();
    }

    const gasLimit = await send(
      sendParameters,
      { nativeFee, lzTokenFee },
      await masa.config.signer.getAddress(),
      {
        value:
          masa.config.networkName === "masa" ||
          masa.config.networkName === "masatest"
            ? nativeFee.add(sendParameters.amountLD)
            : nativeFee,
      },
    );

    const transactionCost = gasLimit.mul(gasPrice);

    result = {
      success: true,
      nativeFee,
      lzTokenFee,
      gasLimit,
      transactionCost,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      result.message = `Failed to quote send! ${error.message}`;
      console.error(result.message);
    }
  }

  return result;
};

/**
 *
 * @param eid
 * @param receiverAddress
 * @param tokenAmount
 * @param slippage
 */
export const getSwapParameters = (
  eid: EndpointId,
  receiverAddress: string,
  tokenAmount: BigNumber,
  slippage: number = 250,
): {
  sendParameters:
    | SendParamStructMasaToken
    | SendParamStructMasaTokenNativeOFT
    | SendParamStructMasaTokenOFT;
  slippage: number;
} => {
  const options = Options.newOptions()
    .addExecutorLzReceiveOption(200_000, 0)
    .toHex()
    .toString();

  // add 2.5% slippage
  const tokenAmountWithSlippage = tokenAmount.add(
    tokenAmount.mul(slippage).div(10_000),
  );

  const sendParameters:
    | SendParamStructMasaToken
    | SendParamStructMasaTokenNativeOFT
    | SendParamStructMasaTokenOFT = {
    dstEid: eid, // Destination endpoint ID.
    to: utils.zeroPad(receiverAddress, 32), // Recipient address.
    amountLD: tokenAmountWithSlippage, // Amount to send in local decimals.
    minAmountLD: tokenAmount, // Minimum amount to send in local decimals.
    extraOptions: options, // Additional options supplied by the caller to be used in the LayerZero message.
    composeMsg: "0x", // The composed message for the send() operation.
    oftCmd: "0x", // The OFT command to be executed, unused in default OFT implementations.
  };

  return {
    sendParameters,
    slippage,
  };
};

export interface SwapResult extends BaseResult {
  layerZeroScanUrl?: string;
}

/**
 *
 * @param masa
 * @param to
 * @param amount
 * @param slippage
 */
export const swap = async (
  masa: MasaInterface,
  to: NetworkName,
  amount: string,
  slippage?: number,
): Promise<SwapResult> => {
  const result: SwapResult = {
    success: false,
  };

  console.log(
    `Swapping ${parseFloat(amount).toLocaleString()} MASA from '${masa.config.networkName}' to '${to}'!`,
  );

  // current wallet
  const address = await masa.config.signer.getAddress();
  const { lzEndpointId: toEID } = SupportedNetworks[to] ?? {};

  if (!masa.config.network?.addresses.tokens?.MASA || !toEID) {
    result.message = `Unable to swap from ${masa.config.networkName} to ${to}!`;
    console.error(result.message);

    return result;
  }

  const tokenAmount = BigNumber.from(utils.parseEther(amount));

  const { sendParameters, slippage: actualSlippage } = getSwapParameters(
    toEID,
    address,
    tokenAmount,
    slippage,
  );

  console.log(
    `Tokens: ${utils.formatEther(sendParameters.minAmountLD)} Tokens with Slippage: ${utils.formatEther(sendParameters.amountLD)} (${actualSlippage / 100}%)`,
  );

  const oft = loadOFTContract(masa);

  if (!oft) {
    result.message = "Unable to load OFT!";
    console.error(result.message);

    return result;
  }

  try {
    const { send } = oft;

    const peer = await oft.peers(toEID);

    if (peer === utils.hexZeroPad(constants.AddressZero, 32)) {
      result.message = `'${oft.address}' has no registered peer for network ${toEID}!`;
      console.error(result.message);
      return result;
    }

    const fees = await getSwapQuote(masa, sendParameters);

    if (!fees.success) {
      result.message = `Unable to load fees! ${fees.message}`;
      console.error(result.message);
      return result;
    }

    if ("nativeFee" in fees) {
      console.log(
        `Fees NativeFee: ${utils.formatEther(fees.nativeFee)} LZTokenFee: ${utils.formatEther(fees.lzTokenFee)}`,
      );

      console.log("Swapping ...");

      const { wait, hash } = await send(sendParameters, fees, address, {
        value:
          masa.config.networkName === "masa" ||
          masa.config.networkName === "masatest"
            ? fees.nativeFee.add(sendParameters.amountLD)
            : fees.nativeFee,
      });

      console.log(
        Messages.WaitingToFinalize(
          hash,
          masa.config.network.blockExplorerUrls?.[0],
        ),
      );

      await wait();

      result.success = true;
      result.layerZeroScanUrl = lzUrl(hash, masa.config.network.isTestnet);

      console.log(
        `Swap done! Please note: it can take some times (20-30 mins) for the token to show up on the target network! You can check the status on Layerzero scan: ${result.layerZeroScanUrl}`,
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      result.message = `Swap failed! ${error.message}`;
      console.error(result.message);
    }
  }

  return result;
};
