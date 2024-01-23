import { LogDescription } from "@ethersproject/abi";
import type { BigNumber } from "@ethersproject/bignumber";

import {
  BaseErrorCodes,
  Messages,
  SoulNameErrorCodes,
} from "../../collections";
import { parseEthersError } from "../../contracts/contract-modules/ethers";
import type {
  BaseResultWithTokenId,
  CreateSoulNameResult,
  MasaInterface,
  PaymentMethod,
} from "../../interface";
import { isSoulNameMetadataStoreResult, logger } from "../../utils";

/**
 * Identity only
 * @param masa
 */
export const purchaseIdentity = async (
  masa: MasaInterface,
): Promise<BaseResultWithTokenId> => {
  let result: BaseResultWithTokenId = {
    success: false,
    errorCode: BaseErrorCodes.UnknownError,
  };

  const { purchase } = masa.contracts.identity;

  try {
    const { wait, hash } = await purchase();

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

    const identityMintEvent = parsedLogs.find(
      (event: LogDescription) => event.name === "Mint",
    );

    if (identityMintEvent) {
      if (masa.config.verbose) {
        logger("dir", { identityMintEvent });
      }

      tokenId = (identityMintEvent.args._tokenId as BigNumber).toString();
      logger("log", `Identity with ID: '${tokenId}' created.`);
    }

    if (tokenId) {
      result = {
        ...result,
        tokenId,
      };
    }
  } catch (error: unknown) {
    result.message = "Purchasing Identity failed! ";

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
 */
export const createIdentity = async (
  masa: MasaInterface,
): Promise<BaseResultWithTokenId> => {
  const result: BaseResultWithTokenId = {
    success: false,
    errorCode: BaseErrorCodes.UnknownError,
  };

  if (
    !masa.contracts.instances.SoulStoreContract.hasAddress ||
    !masa.contracts.instances.SoulboundIdentityContract.hasAddress
  ) {
    result.message = Messages.ContractNotDeployed(masa.config.networkName);
    result.errorCode = BaseErrorCodes.NetworkError;
    return result;
  }

  const { identityId } = await masa.identity.load();

  if (identityId) {
    result.message = `Identity already created! '${identityId.toNumber()}'`;
    result.errorCode = BaseErrorCodes.AlreadyExists;
    logger("error", result);

    return result;
  }

  logger("log", "Creating Identity ...");
  return await purchaseIdentity(masa);
};

/**
 * Identity with soul name
 * @param masa
 * @param soulName
 * @param soulNameLength
 * @param duration
 * @param paymentMethod
 * @param style
 */
export const purchaseIdentityWithSoulName = async (
  masa: MasaInterface,
  soulName: string,
  soulNameLength: number,
  duration: number,
  paymentMethod: PaymentMethod,
  style?: string,
): Promise<{ identityId?: string | BigNumber } & CreateSoulNameResult> => {
  const result: { identityId?: string | BigNumber } & CreateSoulNameResult = {
    success: false,
    errorCode: BaseErrorCodes.UnknownError,
  };

  const [extension, isAvailable] = await Promise.all([
    masa.contracts.instances.SoulNameContract.extension(),
    masa.contracts.soulName.isAvailable(soulName),
  ]);

  if (isAvailable) {
    const storeMetadataResponse = await masa.client.soulName.store(
      `${soulName}${extension}`,
      await masa.config.signer.getAddress(),
      duration,
      style,
    );

    if (storeMetadataResponse) {
      if (isSoulNameMetadataStoreResult(storeMetadataResponse)) {
        try {
          const soulNameMetadataUrl = `${masa.soulName.getSoulNameMetadataPrefix()}${
            storeMetadataResponse.metadataTransaction.id
          }`;
          logger("log", `Soul Name Metadata URL: '${soulNameMetadataUrl}'`);

          const { wait, hash } =
            await masa.contracts.identity.purchaseIdentityAndName(
              paymentMethod,
              soulName,
              soulNameLength,
              duration,
              soulNameMetadataUrl,
              storeMetadataResponse.authorityAddress,
              storeMetadataResponse.signature,
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

          {
            let identityId: string | undefined, tokenId: string | undefined;

            const identityMintEvent = parsedLogs.find(
              (event: LogDescription) => event.name === "Mint",
            );

            if (identityMintEvent) {
              if (masa.config.verbose) {
                logger("dir", { identityMintEvent });
              }

              identityId = (
                identityMintEvent.args._tokenId as BigNumber
              ).toString();
              logger("log", `Identity with ID: '${identityId}' created.`);
            }

            const soulnameTransferEvent = parsedLogs.find(
              (event: LogDescription) => event.name === "Transfer",
            );

            if (soulnameTransferEvent) {
              const { args: soulnameTransferEventArgs } = soulnameTransferEvent;
              if (masa.config.verbose) {
                logger("dir", { soulnameTransferEventArgs });
              }

              tokenId = (
                soulnameTransferEventArgs.tokenId as BigNumber
              ).toString();
              logger("log", `SoulName with ID: '${tokenId}' created.`);
            }

            if (identityId && tokenId) {
              result.success = true;
              delete result.errorCode;

              result.tokenId = tokenId;
              result.identityId = identityId;
              result.soulName = soulName;
            }
          }
        } catch (error: unknown) {
          result.message = "Creating Soul Name failed! ";

          const { message, errorCode } = parseEthersError(error);

          result.message += message;
          result.errorCode = errorCode;
        }
      } else {
        result.success = storeMetadataResponse.success;
        result.message = storeMetadataResponse.message;
        result.errorCode = storeMetadataResponse.errorCode;
      }
    }
  } else {
    result.message = `Soulname ${soulName}${extension} already taken.`;
    result.errorCode = SoulNameErrorCodes.SoulNameError;
  }

  return result;
};

/**
 *
 * @param masa
 * @param paymentMethod
 * @param soulName
 * @param duration
 * @param style
 */
export const createIdentityWithSoulName = async (
  masa: MasaInterface,
  paymentMethod: PaymentMethod,
  soulName: string,
  duration: number,
  style?: string,
): Promise<
  {
    identityId?: string | BigNumber;
  } & CreateSoulNameResult
> => {
  const result: CreateSoulNameResult = {
    success: false,
    errorCode: BaseErrorCodes.UnknownError,
  };

  if (await masa.session.checkLogin()) {
    if (
      !masa.contracts.instances.SoulStoreContract.hasAddress ||
      !masa.contracts.instances.SoulboundIdentityContract.hasAddress ||
      !masa.contracts.instances.SoulNameContract.hasAddress
    ) {
      result.message = Messages.ContractNotDeployed(masa.config.networkName);
      result.errorCode = BaseErrorCodes.NetworkError;
      return result;
    }

    const extension =
      await masa.contracts.instances.SoulNameContract.extension();

    if (soulName.endsWith(extension)) {
      soulName = soulName.replace(extension, "");
    }

    const { isValid, length } = masa.soulName.validate(soulName);

    if (!isValid) {
      result.message = "Soulname not valid!";
      result.errorCode = SoulNameErrorCodes.SoulNameError;
      logger("error", result);

      return result;
    }

    const address = await masa.config.signer.getAddress();
    const { identityId } = await masa.identity.load(address);

    if (identityId) {
      result.message = `Identity already created! '${identityId.toNumber()}'`;
      result.errorCode = SoulNameErrorCodes.SoulNameError;
      logger("error", result);

      return result;
    }

    if (masa.config.verbose) {
      logger("info", "Purchasing Identity with Soulname");
    }

    return await purchaseIdentityWithSoulName(
      masa,
      soulName,
      length,
      duration,
      paymentMethod,
      style,
    );
  } else {
    result.message = Messages.NotLoggedIn();
    result.errorCode = BaseErrorCodes.NotLoggedIn;
  }

  return result;
};
