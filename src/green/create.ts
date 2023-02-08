import Masa from "../masa";
import { BaseResult, CreateGreenResult } from "../interface";
import { PaymentMethod } from "../contracts";
import { BigNumber, ethers, Event } from "ethers";
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
    const greenGenerateResult = await masa.client.green.generate(phoneNumber);

    if (masa.config.verbose) {
      console.log({ greenGenerateResult });
    }
    return greenGenerateResult;
  } else {
    console.error(Messages.NotLoggedIn());
  }
};

export const verifyGreen = async (
  masa: Masa,
  phoneNumber: string,
  code: string
): Promise<
  | (BaseResult & {
      status?: string;
      signature?: string;
      signatureDate?: number;
      authorityAddress?: string;
      errorCode?: number;
    })
  | undefined
> => {
  const result: BaseResult & {
    status?: string;
    signature?: string;
    signatureDate?: number;
    authorityAddress?: string;
    errorCode?: number;
  } = {
    success: false,
    message: "Unknown Verify Error",
  };

  // try to verify with the code
  const greenVerifyResult = await masa.client.green.verify(
    phoneNumber,
    code,
    masa.config.network
  );

  if (masa.config.verbose) {
    console.log({ greenVerifyResult });
  }

  // we got a verification result
  if (greenVerifyResult) {
    result.success = greenVerifyResult.success;
    result.status = greenVerifyResult.status;
    result.message = greenVerifyResult.message;

    if (
      greenVerifyResult.signature &&
      greenVerifyResult.signatureDate &&
      greenVerifyResult.authorityAddress
    ) {
      // unpack the relevant data we need to proceed
      result.signature = greenVerifyResult.signature;
      result.signatureDate = greenVerifyResult.signatureDate;
      result.authorityAddress = greenVerifyResult.authorityAddress;
    } else if (greenVerifyResult.errorCode) {
      // error code, unpack the error code
      result.errorCode = greenVerifyResult.errorCode;
    }
  }

  return result;
};

export const createGreen = async (
  masa: Masa,
  phoneNumber: string,
  code: string
): Promise<CreateGreenResult> => {
  const result: CreateGreenResult = {
    success: false,
    message: "Unknown Create Error",
  };

  // verify
  const verifyGreenResult = await verifyGreen(masa, phoneNumber, code);

  if (masa.config.verbose) {
    console.log({ verifyGreenResult });
  }

  if (verifyGreenResult) {
    result.status = verifyGreenResult.status;
    result.message = verifyGreenResult.message;

    if (
      verifyGreenResult.authorityAddress &&
      verifyGreenResult.signatureDate &&
      verifyGreenResult.signature
    ) {
      // mint
      const mintGreenResult = await mintGreen(
        masa,
        verifyGreenResult.authorityAddress,
        verifyGreenResult.signatureDate,
        verifyGreenResult.signature
      );

      if (masa.config.verbose) {
        console.log({ mintGreenResult });
      }

      if (mintGreenResult) {
        result.success = true;
        result.message = "";
        result.tokenId = mintGreenResult.tokenId;
      }
    } else {
      result.errorCode = verifyGreenResult.errorCode;
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
    const mintEvent = receipt.events.find((e: Event) => e.event === "Mint");
    if (mintEvent && mintEvent.args) {
      return {
        tokenId: mintEvent.args._tokenId,
      };
    }
  }
};
