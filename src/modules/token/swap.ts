import { EndpointId } from "@layerzerolabs/lz-definitions";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import addressesRaw from "@masa-finance/masa-token/addresses.json";
import {
  MasaToken__factory,
  MasaTokenAdapter__factory,
  MasaTokenOFT__factory,
} from "@masa-finance/masa-token/dist/typechain";
import { BigNumber, ethers, utils } from "ethers";

import { Messages, SupportedNetworks } from "../../collections";
import { MasaInterface, NetworkName } from "../../interface";

const addresses = addressesRaw as Partial<{
  [key in NetworkName]: { [key: string]: string };
}>;

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
) => {
  const tokenAmount = BigNumber.from(utils.parseEther(amount));

  // add 2,5% slippage
  const tokenAmountWithSlippage = tokenAmount.add(
    tokenAmount.mul(slippage).div(10000),
  );

  console.log(
    `Swapping ${parseFloat(amount).toLocaleString()} MASA from ${masa.config.networkName} to ${to}!`,
  );

  // current wallet
  const address = await masa.config.signer.getAddress();

  const fromAddresses = addresses[masa.config.networkName];
  const toAddresses = addresses[to];

  const toEID = SupportedNetworks[to]?.lzEndpointId;

  if (!fromAddresses || !toAddresses || !toEID) {
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
  const oft = fromAddresses.MasaTokenAdapter
    ? MasaTokenAdapter__factory.connect(
        fromAddresses.MasaTokenAdapter,
        masa.config.signer,
      )
    : MasaTokenOFT__factory.connect(
        fromAddresses.MasaTokenOFT,
        masa.config.signer,
      );

  try {
    const { quoteSend, send } = oft;

    const isPeer = await oft.isPeer(
      toEID,
      utils.zeroPad(
        toAddresses.MasaTokenAdapter ?? toAddresses.MasaTokenOFT,
        32,
      ),
    );

    if (!isPeer) {
      console.error("No peer found");
    }

    const [nativeFee] = await quoteSend(sendParam as never, false);

    if (fromAddresses.MasaToken) {
      const masaToken = MasaToken__factory.connect(
        fromAddresses.MasaToken,
        masa.config.signer,
      );

      const currentAllowance = await masaToken.allowance(address, oft.address);

      if (currentAllowance.lt(tokenAmountWithSlippage)) {
        const newAllowance = tokenAmountWithSlippage.sub(currentAllowance);

        console.log(`Increasing allowance: ${utils.formatEther(newAllowance)}`);

        const { wait, hash } = await masaToken.increaseAllowance(
          oft.address,
          newAllowance,
        );

        console.log(Messages.WaitingToFinalize(hash));

        await wait();
      }
    }

    console.log("Swapping ...");

    const { wait, hash } = await send(
      sendParam as never,
      {
        nativeFee,
        lzTokenFee: 0,
      },
      address,
      {
        value: nativeFee,
      },
    );

    console.log(Messages.WaitingToFinalize(hash));

    await wait();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};
