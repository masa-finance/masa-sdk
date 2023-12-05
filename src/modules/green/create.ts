import { LogDescription } from "@ethersproject/abi";

import { BaseErrorCodes, Messages } from "../../collections";
import { parseEthersError } from "../../contracts/contract-modules/ethers";
import type {
  BaseResultWithTokenId,
  GenerateGreenResult,
  GreenBaseResult,
  MasaInterface,
  PaymentMethod,
  VerifyGreenResult,
} from "../../interface";
import { logger } from "../../utils";

/**
 *
 * @param masa
 * @param phoneNumber
 */
export const generateGreen = async (
  masa: MasaInterface,
  phoneNumber: string,
): Promise<GenerateGreenResult> => {
  let result: GenerateGreenResult = {
    success: false,
    errorCode: BaseErrorCodes.UnknownError,
  };

  if (await masa.session.checkLogin()) {
    if (!masa.contracts.instances.SoulboundGreenContract.hasAddress) {
      result.message = Messages.ContractNotDeployed(masa.config.networkName);
      result.errorCode = BaseErrorCodes.NetworkError;
      return result;
    }

    try {
      const balance =
        await masa.contracts.instances.SoulboundGreenContract.balanceOf(
          await masa.config.signer.getAddress(),
        );

      if (balance.eq(0)) {
        const greenGenerateResult =
          await masa.client.green.generate(phoneNumber);

        if (masa.config.verbose) {
          logger("dir", { greenGenerateResult });
        }

        return greenGenerateResult;
      } else {
        const message = "Masa Green already created!";
        result = {
          ...result,
          message,
          status: "failed",
          errorCode: BaseErrorCodes.AlreadyExists,
        };
      }
    } catch (error: unknown) {
      const { message, errorCode } = parseEthersError(error);

      result.message = message;
      result.errorCode = errorCode;

      logger("error", result);
    }
  } else {
    result.message = Messages.NotLoggedIn();
    result.errorCode = BaseErrorCodes.NotLoggedIn;
  }

  return result;
};

/**
 *
 * @param masa
 * @param phoneNumber
 * @param code
 */
export const verifyGreen = async (
  masa: MasaInterface,
  phoneNumber: string,
  code: string,
): Promise<VerifyGreenResult> => {
  const result: VerifyGreenResult = {
    success: false,
    errorCode: BaseErrorCodes.UnknownError,
  };

  // try to verify with the code
  const greenVerifyResult = await masa.client.green.verify(phoneNumber, code);

  if (masa.config.verbose) {
    logger("dir", { greenVerifyResult });
  }

  // we got a verification result
  if (greenVerifyResult) {
    result.success = greenVerifyResult.success;
    delete result.errorCode;
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
      result.message = "Unknown Verify Error";
      // error code, unpack the error code
      result.errorCode = greenVerifyResult.errorCode;
    }
  }

  return result;
};

/**
 *
 * @param masa
 * @param paymentMethod
 * @param authorityAddress
 * @param signatureDate
 * @param signature
 */
export const mintGreen = async (
  masa: MasaInterface,
  paymentMethod: PaymentMethod,
  authorityAddress: string,
  signatureDate: number,
  signature: string,
): Promise<BaseResultWithTokenId> => {
  let result: BaseResultWithTokenId = {
    success: false,
    errorCode: BaseErrorCodes.UnknownError,
  };

  try {
    const { wait, hash } = await masa.contracts.green.mint(
      paymentMethod,
      await masa.config.signer.getAddress(),
      authorityAddress,
      signatureDate,
      signature,
    );

    logger(
      "log",
      Messages.WaitingToFinalize(
        hash,
        masa.config.network?.blockExplorerUrls?.[0],
      ),
    );

    const { logs } = await wait();

    const parsedLogs = masa.contracts.parseLogs(logs);

    let tokenId: string | undefined;

    const greenMintEvent = parsedLogs.find(
      (event: LogDescription) => event.name === "Mint",
    );

    if (greenMintEvent) {
      if (masa.config.verbose) {
        logger("dir", { greenMintEvent });
      }

      tokenId = greenMintEvent.args._tokenId.toString();
      logger("log", `Green with ID: '${tokenId}' created.`);
    }

    if (tokenId) {
      result = {
        ...result,
        success: true,
        tokenId,
      };
    }
  } catch (error: unknown) {
    result.message = "Minting green failed! ";

    const { message, errorCode } = parseEthersError(error);

    result.message += message;
    result.errorCode = errorCode;

    logger("error", result);
  }

  return result;
};

/**
 *
 * @param masa
 * @param paymentMethod
 * @param phoneNumber
 * @param code
 */
export const createGreen = async (
  masa: MasaInterface,
  paymentMethod: PaymentMethod,
  phoneNumber: string,
  code: string,
): Promise<GreenBaseResult> => {
  const result: GreenBaseResult = {
    success: false,
    errorCode: BaseErrorCodes.UnknownError,
  };

  // verify
  const verifyGreenResult: VerifyGreenResult = await verifyGreen(
    masa,
    phoneNumber,
    code,
  );

  if (masa.config.verbose) {
    logger("dir", { verifyGreenResult });
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
        verifyGreenResult.signature,
      );

      if (masa.config.verbose) {
        logger("dir", { mintGreenResult });
      }

      if (mintGreenResult) {
        result.success = true;
        delete result.errorCode;
        result.tokenId = mintGreenResult.tokenId;
      }
    } else {
      result.errorCode = verifyGreenResult.errorCode;
    }
  }

  return result;
};
