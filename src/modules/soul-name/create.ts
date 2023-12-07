import { LogDescription } from "@ethersproject/abi";
import { BigNumber } from "ethers";

import {
  BaseErrorCodes,
  Messages,
  SoulNameErrorCodes,
} from "../../collections";
import { parseEthersError } from "../../contracts/contract-modules/ethers";
import type {
  CreateSoulNameResult,
  MasaInterface,
  PaymentMethod,
  SoulNameMetadataStoreResult,
  SoulNameResultBase,
} from "../../interface";
import { isSoulNameMetadataStoreResult, logger } from "../../utils";

const purchaseSoulName = async (
  masa: MasaInterface,
  paymentMethod: PaymentMethod,
  soulName: string,
  soulNameLength: number,
  duration: number,
  receiver?: string,
  style?: string,
): Promise<CreateSoulNameResult> => {
  const result: CreateSoulNameResult = {
    success: false,
    errorCode: BaseErrorCodes.UnknownError,
  };

  const [extension, isAvailable] = await Promise.all([
    masa.contracts.instances.SoulNameContract.extension(),
    masa.contracts.soulName.isAvailable(soulName),
  ]);

  if (isAvailable) {
    receiver = receiver ?? (await masa.config.signer.getAddress());

    const storeMetadataResponse:
      | SoulNameMetadataStoreResult
      | SoulNameResultBase
      | undefined = await masa.client.soulName.store(
      `${soulName}${extension}`,
      receiver,
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

          const { wait, hash } = await masa.contracts.soulName.purchase(
            paymentMethod,
            soulName,
            soulNameLength,
            duration,
            soulNameMetadataUrl,
            storeMetadataResponse.authorityAddress,
            storeMetadataResponse.signature,
            receiver,
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
            let tokenId: string | undefined;

            const soulnameTransferEvent: LogDescription | undefined =
              parsedLogs.find(
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

            if (tokenId) {
              result.success = true;
              delete result.errorCode;
              result.tokenId = tokenId;
              result.soulName = soulName;
            }
          }
        } catch (error: unknown) {
          result.message = "Creating Soul Name failed! ";

          const { message, errorCode } = parseEthersError(error);
          result.message += message;
          result.errorCode = errorCode;

          logger("error", result);
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

export const createSoulName = async (
  masa: MasaInterface,
  paymentMethod: PaymentMethod,
  soulName: string,
  duration: number,
  receiver?: string,
  style?: string,
): Promise<CreateSoulNameResult> => {
  const result: CreateSoulNameResult = {
    success: false,
    errorCode: BaseErrorCodes.UnknownError,
  };

  if (await masa.session.checkLogin()) {
    if (
      !masa.contracts.instances.SoulStoreContract.hasAddress ||
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

    const { identityId, address } = await masa.identity.load();
    if (!identityId) {
      result.message = Messages.NoIdentity(address);
      result.errorCode = BaseErrorCodes.DoesNotExist;
      return result;
    }

    if (masa.config.verbose) {
      logger("info", "Purchasing Soulname");
    }

    return await purchaseSoulName(
      masa,
      paymentMethod,
      soulName,
      length,
      duration,
      receiver,
      style,
    );
  } else {
    result.message = Messages.NotLoggedIn();
    result.errorCode = BaseErrorCodes.NotLoggedIn;
  }

  return result;
};
