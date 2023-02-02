import Masa from "../masa";
import { BaseResult, CreateGreenResult } from "../interface";
import { PaymentMethod } from "../contracts";
import { BigNumber, ethers } from "ethers";
import { Messages } from "../utils";

export const generateGreen = async (
  masa: Masa,
  phoneNumber: string
): Promise<
  | (BaseResult & {
      status: string;
    })
  | undefined
> => {
  if (await masa.session.checkLogin()) {
    return masa.client.green.generate(phoneNumber);
  } else {
    console.error(Messages.NotLoggedIn());
  }
};

export const verifyGreen = async (
  masa: Masa,
  phoneNumber: string,
  code: string
): Promise<
  | { signature: string; signatureDate: number; authorityAddress: string }
  | undefined
> => {
  const greenVerifyResult = await masa.client.green.verify(
    phoneNumber,
    code,
    masa.config.network
  );

  if (masa.config.verbose) {
    console.log({ greenVerifyResult });
  }

  if (
    greenVerifyResult &&
    greenVerifyResult.signature &&
    greenVerifyResult.signatureDate &&
    greenVerifyResult.authorityAddress
  ) {
    return {
      signature: greenVerifyResult.signature,
      signatureDate: greenVerifyResult.signatureDate,
      authorityAddress: greenVerifyResult.authorityAddress,
    };
  }
};

export const createGreen = async (
  masa: Masa,
  phoneNumber: string,
  code: string
): Promise<CreateGreenResult> => {
  const result: CreateGreenResult = {
    success: false,
    message: "Unknown Error",
  };

  // verify
  const greenVerifyResult = await verifyGreen(masa, phoneNumber, code);

  if (greenVerifyResult) {
    // mint
    const mintResult = await mintGreen(
      masa,
      greenVerifyResult.authorityAddress,
      greenVerifyResult.signatureDate,
      greenVerifyResult.signature
    );

    if (mintResult) {
      result.success = true;
      result.message = "";
      result.tokenId = mintResult.tokenId;
    }
  }

  return result;
};

export const mintGreen = async (
  masa: Masa,
  authorityAddress: string,
  signatureDate: number,
  signature: string,
  paymentMethod: PaymentMethod = "eth"
): Promise<{ tokenId: BigNumber } | undefined> => {
  console.log("Minting green");

  const tx = await masa.contracts.green.mint(
    masa.config.wallet as ethers.Wallet,
    paymentMethod,
    await masa.config.wallet.getAddress(),
    authorityAddress,
    signatureDate,
    signature
  );

  console.log(Messages.WaitingToFinalize(tx.hash));
  const receipt = await tx.wait();

  if (receipt.events) {
    const mintEvent = receipt.events.find((e) => e.event === "Mint");
    if (mintEvent && mintEvent.args) {
      return {
        tokenId: mintEvent.args._tokenId,
      };
    }
  }
};
