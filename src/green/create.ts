import Masa from "../masa";
import {
  BaseResult,
  GenerateGreenResult,
  VerifyGreenResult,
} from "../interface";
import { PaymentMethod } from "../contracts";
import { Messages } from "../utils";
import { LogDescription } from "@ethersproject/abi";

export const generateGreen = async (
  masa: Masa,
  phoneNumber: string
): Promise<GenerateGreenResult | undefined> => {
  if (await masa.session.checkLogin()) {
    const balance =
      await masa.contracts.instances.SoulboundGreenContract.balanceOf(
        await masa.config.wallet.getAddress()
      );

    if (balance.eq(0)) {
      const greenGenerateResult = await masa.client.green.generate(phoneNumber);

      if (masa.config.verbose) {
        console.log({ greenGenerateResult });
      }

      return greenGenerateResult;
    } else {
      const message = "Masa Green already created!";
      return {
        success: false,
        message,
        status: "failed",
      };
    }
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
  const greenVerifyResult = await masa.client.green.verify(phoneNumber, code);

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
  paymentMethod: PaymentMethod,
  phoneNumber: string,
  code: string
): Promise<VerifyGreenResult> => {
  const result: VerifyGreenResult = {
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
        paymentMethod,
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
  paymentMethod: PaymentMethod,
  authorityAddress: string,
  signatureDate: number,
  signature: string
): Promise<BaseResult> => {
  const result = {
    success: false,
    message: "Unknown Error",
  };

  const { hash, wait } = await masa.contracts.green.mint(
    paymentMethod,
    await masa.config.wallet.getAddress(),
    authorityAddress,
    signatureDate,
    signature
  );

  console.log(Messages.WaitingToFinalize(hash));

  const { logs } = await wait();

  const parsedLogs = masa.contracts.parseLogs(logs);

  let tokenId: string | undefined;

  const greenMintEvent = parsedLogs.find(
    (event: LogDescription) => event.name === "Mint"
  );

  if (greenMintEvent) {
    if (masa.config.verbose) {
      console.info({ greenMintEvent });
    }

    tokenId = greenMintEvent.args._tokenId.toString();
    console.log(`Green with ID: '${tokenId}' created.`);
  }

  if (tokenId) {
    return {
      success: true,
      message: "",
      tokenId,
    };
  }

  return result;
};
