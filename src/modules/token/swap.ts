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
import { BigNumber, ethers, utils } from "ethers";

import { Messages, SupportedNetworks } from "../../collections";
import { MasaInterface, NetworkName } from "../../interface";

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
  slippage: number = 250,
): Promise<void> => {
  const tokenAmount = BigNumber.from(utils.parseEther(amount));

  // add 2.5% slippage
  const tokenAmountWithSlippage = tokenAmount.add(
    tokenAmount.mul(slippage).div(10000),
  );

  console.log(
    `Swapping ${parseFloat(amount).toLocaleString()} MASA from '${masa.config.networkName}' to '${to}'!`,
  );

  // current wallet
  const address = await masa.config.signer.getAddress();

  const toNetwork = SupportedNetworks[to];
  const toEID = toNetwork?.lzEndpointId;

  if (!masa.config.network?.addresses.tokens?.MASA || !toNetwork || !toEID) {
    console.log(`Unable to swap from ${masa.config.networkName} to ${to}!`);
    return;
  }

  // console.log(masa.config.networkName, fromAddresses, to, toAddresses);

  const options = Options.newOptions()
    .addExecutorLzReceiveOption(200000, 0)
    .toHex()
    .toString();

  // console.log(utils.hexlify(utils.zeroPad(toAddresses.MasaTokenAdapter, 32)));

  const sendParam: [
    EndpointId,
    Uint8Array,
    BigNumber,
    BigNumber,
    string,
    string,
    string,
  ] = [
    toEID, // Destination endpoint ID.
    utils.zeroPad(address, 32), // Recipient address.
    tokenAmountWithSlippage, // Amount to send in local decimals.
    tokenAmount, // Minimum amount to send in local decimals.
    options, // Additional options supplied by the caller to be used in the LayerZero message.
    "0x", // The composed message for the send() operation.
    "0x", // The OFT command to be executed, unused in default OFT implementations.
  ];

  console.log(
    `Tokens: ${ethers.utils.formatEther(tokenAmount)} Tokens with Slippage: ${ethers.utils.formatEther(tokenAmountWithSlippage)}`,
  );

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

  if (!oft) {
    console.error("Unable to load token");
    return;
  }

  try {
    const { quoteSend, send } = oft;

    const isPeer = await oft.isPeer(
      toEID,
      utils.zeroPad(toNetwork.addresses.tokens?.MASA ?? "", 32),
    );

    if (!isPeer) {
      console.error("No peer found");
    }

    const { nativeFee, lzTokenFee } = await quoteSend(
      sendParam as never,
      false,
    );

    console.log("Swapping ...");

    const { wait, hash } = await send(
      sendParam as never,
      {
        nativeFee,
        lzTokenFee,
      },
      address,
      {
        value:
          masa.config.networkName === "masa" ||
          masa.config.networkName === "masatest"
            ? nativeFee.add(tokenAmountWithSlippage)
            : nativeFee,
      },
    );

    console.log(
      Messages.WaitingToFinalize(
        hash,
        masa.config.network.blockExplorerUrls?.[0],
      ),
    );

    await wait();

    console.log(
      "Swap done! Please note: it can take some times (20-30 mins) for the token to show up on the target network!",
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};
