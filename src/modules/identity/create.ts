import { LogDescription } from "@ethersproject/abi";
import type { BigNumber } from "@ethersproject/bignumber";

import {
  BaseErrorCodes,
  Messages,
  SoulNameErrorCodes,
} from "../../collections";
import type {
  BaseResultWithTokenId,
  CreateSoulNameResult,
  MasaInterface,
  PaymentMethod,
} from "../../interface";
import { isSoulNameMetadataStoreResult } from "../../utils";

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

  const { wait, hash } = await masa.contracts.identity.purchase();
  console.log(
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
      console.info({ identityMintEvent });
    }

    tokenId = identityMintEvent.args._tokenId.toString();
    console.log(`Identity with ID: '${tokenId}' created.`);
  }

  if (tokenId) {
    result = {
      ...result,
      tokenId,
    };
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
    result.message = `Identity already created! '${identityId}'`;
    result.errorCode = BaseErrorCodes.AlreadyExists;

    console.error(result.message);
    return result;
  }

  console.log("Creating Identity ...");
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
          console.log(`Soul Name Metadata URL: '${soulNameMetadataUrl}'`);

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

          console.log(
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
                console.info({ identityMintEvent });
              }

              identityId = identityMintEvent.args._tokenId.toString();
              console.log(`Identity with ID: '${identityId}' created.`);
            }

            const soulnameTransferEvent = parsedLogs.find(
              (event: LogDescription) => event.name === "Transfer",
            );

            if (soulnameTransferEvent) {
              const { args: soulnameTransferEventArgs } = soulnameTransferEvent;
              if (masa.config.verbose) {
                console.dir({ soulnameTransferEventArgs }, { depth: null });
              }

              tokenId = soulnameTransferEventArgs.tokenId.toString();
              console.log(`SoulName with ID: '${tokenId}' created.`);
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
          result.errorCode = BaseErrorCodes.NetworkError;
          if (error instanceof Error) {
            result.message = `Creating Soul Name failed! ${error.message}`;
          }
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

      console.error(result.message);
      return result;
    }

    const address = await masa.config.signer.getAddress();
    const { identityId } = await masa.identity.load(address);

    if (identityId) {
      result.message = `Identity already created! '${identityId}'`;
      result.errorCode = SoulNameErrorCodes.SoulNameError;

      console.error(result.message);
      return result;
    }

    if (masa.config.verbose) {
      console.info("Purchasing Identity with Soulname");
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
  }

  return result;
};
