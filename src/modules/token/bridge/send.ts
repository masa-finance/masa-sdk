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

import { Messages, SupportedNetworks } from "../../../collections";
import { BaseResult, MasaInterface, NetworkName } from "../../../interface";
import { isSigner } from "../../../utils";

const lzUrl = (txHash: string, testnet: boolean = false) =>
  `https://${testnet ? "testnet." : ""}layerzeroscan.com/tx/${txHash}`;

export interface QuoteResult extends BaseResult {
  nativeFee: BigNumber;
  lzTokenFee: BigNumber;
  gasLimit?: BigNumber;
  transactionCost?: BigNumber;
}

export interface SendResult extends BaseResult {
  layerZeroScanUrl?: string;
}

/**
 *
 * @param masa
 */
export const loadOFTContract = (
  masa: MasaInterface,
): MasaToken | MasaTokenOFT | MasaTokenNativeOFT | undefined => {
  if (
    !masa.config.network?.addresses.tokens?.MASA ||
    !isSigner(masa.config.signer)
  ) {
    return undefined;
  }

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

/**
 *
 * @param masa
 * @param oft
 * @param sendParameters
 * @param fees
 */
const loadTransactionCost = async (
  masa: MasaInterface,
  oft: MasaToken | MasaTokenOFT | MasaTokenNativeOFT,
  sendParameters:
    | SendParamStructMasaToken
    | SendParamStructMasaTokenNativeOFT
    | SendParamStructMasaTokenOFT,
  fees: {
    nativeFee: BigNumber;
    lzTokenFee: BigNumber;
  },
): Promise<{
  gasLimit?: BigNumber;
  transactionCost?: BigNumber;
}> => {
  const { nativeFee, lzTokenFee } = fees;

  let gasLimit, transactionCost;

  if (isSigner(masa.config.signer)) {
    const {
      estimateGas: { send },
    } = oft;

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

    try {
      gasLimit = await send(
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

      transactionCost = gasLimit.mul(gasPrice);
    } catch {
      console.warn("Unable to load transaction cost!");
    }
  }

  return {
    gasLimit,
    transactionCost,
  };
};

/**
 *
 * @param masa
 * @param sendParameters
 */
export const getSendQuote = async (
  masa: MasaInterface,
  sendParameters:
    | SendParamStructMasaToken
    | SendParamStructMasaTokenNativeOFT
    | SendParamStructMasaTokenOFT,
): Promise<BaseResult | QuoteResult> => {
  let result: BaseResult | QuoteResult = {
    success: false,
  };

  const { MasaToken: oft } = masa.contracts.instances;

  if (!oft) {
    result.message = "Unable to load OFT!";
    console.error(result);
    return result;
  }

  try {
    const { quoteSend } = oft;

    const { nativeFee, lzTokenFee } = await quoteSend(sendParameters, false);

    const { gasLimit, transactionCost } = await loadTransactionCost(
      masa,
      oft,
      sendParameters,
      {
        nativeFee,
        lzTokenFee,
      },
    );

    result = {
      success: true,
      nativeFee,
      lzTokenFee,
      gasLimit,
      transactionCost,
    };
  } catch (error: unknown) {
    result.message = "Failed to quote send!";

    if (error instanceof Error) {
      result.message = `${result.message}: ${error.message}`;
    }

    console.error(result.message);
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
export const getSendParameters = (
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

/**
 *
 * @param masa
 * @param to
 * @param amount
 * @param slippage
 */
export const send = async (
  masa: MasaInterface,
  to: NetworkName,
  amount: string,
  slippage?: number,
): Promise<SendResult> => {
  const result: SendResult = {
    success: false,
  };

  // current wallet
  const { lzEndpointId: toEID } = SupportedNetworks[to] ?? {};

  if (
    !masa.contracts.instances.MasaToken.hasAddress ||
    !toEID ||
    !isSigner(masa.config.signer)
  ) {
    result.message = `Unable to send from ${masa.config.networkName} to ${to}!`;
    console.error(result.message);

    return result;
  }

  console.log(
    `Sending ${parseFloat(amount).toLocaleString()} MASA from '${masa.config.networkName}' to '${to}'!`,
  );

  const address = await masa.config.signer.getAddress();

  const tokenAmount = BigNumber.from(utils.parseEther(amount));

  const { sendParameters, slippage: actualSlippage } = getSendParameters(
    toEID,
    address,
    tokenAmount,
    slippage,
  );

  console.log(
    `Tokens: ${utils.formatEther(sendParameters.minAmountLD)} Tokens with Slippage: ${utils.formatEther(sendParameters.amountLD)} (${(actualSlippage / 100).toFixed(2)}%)`,
  );

  const { MasaToken: oft } = masa.contracts.instances;

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

    const fees = await getSendQuote(masa, sendParameters);

    if (!fees.success) {
      result.message = `Unable to load fees! ${fees.message}`;
      console.error(result.message);
      return result;
    }

    if ("nativeFee" in fees) {
      console.log(
        `Fees NativeFee: ${utils.formatEther(fees.nativeFee)} ${masa.config.network?.nativeCurrency?.symbol} + LZTokenFee: ${utils.formatEther(fees.lzTokenFee)}`,
      );

      if (fees.transactionCost) {
        console.log(
          `Transaction Cost: ${utils.formatEther(fees.transactionCost)} ${masa.config.network?.nativeCurrency?.symbol}`,
        );
      }

      console.log("Sending ...");

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
          masa.config.network?.blockExplorerUrls?.[0],
        ),
      );

      await wait();

      result.success = true;
      result.layerZeroScanUrl = lzUrl(hash, masa.config.network?.isTestnet);

      console.log(
        `Send done! Please note: it can take some times (20-30 mins) for the token to show up on the target network! You can check the status on Layerzero scan: ${result.layerZeroScanUrl}`,
      );
    }
  } catch (error: unknown) {
    result.message = "Send failed!";

    if (error instanceof Error) {
      result.message = `${result.message}: ${error.message}`;
    }

    console.error(result.message);
  }

  return result;
};
