import { BigNumber } from "ethers";
import { LogDescription } from "@ethersproject/abi";
import Masa from "../masa";
import {
  BaseResult,
  CreateSoulNameResult,
  isSoulNameMetadataStoreResult,
  PaymentMethod,
  SoulNameErrorCodes,
} from "../interface";
import { Messages } from "../utils";

export const purchaseIdentity = async (masa: Masa): Promise<BaseResult> => {
  const result = {
    success: false,
    message: "Unknown Error",
  };

  const { hash, wait } = await masa.contracts.identity.purchase();
  console.log(Messages.WaitingToFinalize(hash));

  const { logs } = await wait();
  const parsedLogs = masa.contracts.parseLogs(logs);

  let tokenId: string | undefined;

  const identityMintEvent = parsedLogs.find(
    (event: LogDescription) => event.name === "Mint"
  );

  if (identityMintEvent) {
    if (masa.config.verbose) {
      console.info({ identityMintEvent });
    }

    tokenId = identityMintEvent.args._tokenId.toString();
    console.log(`Identity with ID: '${tokenId}' created.`);
  }

  if (tokenId) {
    return {
      success: false,
      message: "",
      tokenId,
    };
  }

  return result;
};

export const createIdentity = async (masa: Masa): Promise<BaseResult> => {
  const result = {
    success: false,
    message: "Unknown Error",
  };

  const { identityId } = await masa.identity.load();

  if (identityId) {
    result.message = `Identity already created! '${identityId}'`;
    console.error(result.message);
    return result;
  }

  console.log("Creating Identity ...");
  return await purchaseIdentity(masa);
};

export const purchaseIdentityWithSoulName = async (
  masa: Masa,
  soulName: string,
  soulNameLength: number,
  duration: number,
  paymentMethod: PaymentMethod
): Promise<{ identityId?: string | BigNumber } & CreateSoulNameResult> => {
  const result: CreateSoulNameResult = {
    success: false,
    errorCode: SoulNameErrorCodes.UnknownError,
    message: "Unknown Error",
  };

  if (await masa.contracts.soulName.isAvailable(soulName)) {
    const extension =
      await masa.contracts.instances.SoulNameContract.extension();

    const storeMetadataResponse = await masa.client.soulName.store(
      `${soulName}${extension}`,
      await masa.config.wallet.getAddress(),
      duration
    );

    if (storeMetadataResponse) {
      if (isSoulNameMetadataStoreResult(storeMetadataResponse)) {
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
            storeMetadataResponse.signature
          );

        console.log(Messages.WaitingToFinalize(hash));
        const { logs } = await wait();

        const parsedLogs = masa.contracts.parseLogs(logs);

        {
          let identityId: string | undefined, tokenId: string | undefined;

          const identityMintEvent = parsedLogs.find(
            (event: LogDescription) => event.name === "Mint"
          );

          if (identityMintEvent) {
            if (masa.config.verbose) {
              console.info({ identityMintEvent });
            }

            identityId = identityMintEvent.args._tokenId.toString();
            console.log(`Identity with ID: '${identityId}' created.`);
          }

          const soulnameTransferEvent = parsedLogs.find(
            (event: LogDescription) => event.name === "Transfer"
          );

          if (soulnameTransferEvent) {
            if (masa.config.verbose) {
              console.dir({ soulnameTransferEvent }, { depth: null });
            }

            tokenId = soulnameTransferEvent.args.tokenId.toString();
            console.log(`SoulName with ID: '${tokenId}' created.`);
          }

          if (identityId && tokenId) {
            return {
              success: true,
              errorCode: SoulNameErrorCodes.NoError,
              message: "",
              tokenId,
              identityId,
              soulName,
            };
          }
        }
      } else {
        return {
          success: storeMetadataResponse.success,
          message: storeMetadataResponse.message,
          errorCode: storeMetadataResponse.errorCode,
        };
      }
    }
  } else {
    result.message = `Soulname ${soulName}.soul already taken.`;
    result.errorCode = SoulNameErrorCodes.SoulNameError;
    console.error(result.message);
  }

  return result;
};

export const createIdentityWithSoulName = async (
  masa: Masa,
  paymentMethod: PaymentMethod,
  soulName: string,
  duration: number
): Promise<{ identityId?: string | BigNumber } & CreateSoulNameResult> => {
  const result: CreateSoulNameResult = {
    success: false,
    errorCode: SoulNameErrorCodes.UnknownError,
    message: "Unknown Error",
  };

  if (await masa.session.checkLogin()) {
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

    const address = await masa.config.wallet.getAddress();
    const { identityId } = await masa.identity.load(address);

    if (identityId) {
      result.message = `Identity already created! '${identityId}'`;
      result.errorCode = SoulNameErrorCodes.SoulNameError;
      console.error(result.message);
      return result;
    }

    return await purchaseIdentityWithSoulName(
      masa,
      soulName,
      length,
      duration,
      paymentMethod
    );
  } else {
    result.message = Messages.NotLoggedIn();
    console.error(result.message);
  }

  return result;
};
