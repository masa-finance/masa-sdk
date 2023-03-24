import Masa from "../masa";
import { PaymentMethod } from "../contracts";
import {
  CreateSoulNameResult,
  isSoulNameMetadataStoreResult,
  SoulNameErrorCodes,
  SoulNameMetadataStoreResult,
  SoulNameResultBase,
} from "../interface";
import { Messages } from "../utils";
import { LogDescription } from "@ethersproject/abi";

export const getRegistrationPrice = async (
  masa: Masa,
  paymentMethod: PaymentMethod,
  soulName: string,
  duration: number
) => {
  const { length } = masa.soulName.validate(soulName);

  const { price, formattedPrice } = await masa.contracts.soulName.getPrice(
    paymentMethod,
    length,
    duration
  );

  console.log(`Soulname price is ${formattedPrice} ${paymentMethod}.`);

  return price;
};

const purchaseSoulName = async (
  masa: Masa,
  paymentMethod: PaymentMethod,
  soulName: string,
  soulNameLength: number,
  duration: number,
  receiver?: string
): Promise<CreateSoulNameResult> => {
  const result: CreateSoulNameResult = {
    success: false,
    errorCode: SoulNameErrorCodes.UnknownError,
    message: "Unknown Error",
  };

  if (await masa.contracts.soulName.isAvailable(soulName)) {
    const extension =
      await masa.contracts.instances.SoulNameContract.extension();

    receiver = receiver || (await masa.config.wallet.getAddress());

    const storeMetadataResponse:
      | SoulNameMetadataStoreResult
      | SoulNameResultBase
      | undefined = await masa.client.soulName.store(
      `${soulName}${extension}`,
      receiver,
      duration
    );

    if (storeMetadataResponse) {
      if (isSoulNameMetadataStoreResult(storeMetadataResponse)) {
        const soulNameMetadataUrl = `${masa.soulName.getSoulNameMetadataPrefix()}${
          storeMetadataResponse.metadataTransaction.id
        }`;
        console.log(`Soul Name Metadata URL: '${soulNameMetadataUrl}'`);

        const { wait, hash } = await masa.contracts.soulName.purchase(
          paymentMethod,
          soulName,
          soulNameLength,
          duration,
          soulNameMetadataUrl,
          storeMetadataResponse.authorityAddress,
          storeMetadataResponse.signature,
          receiver
        );

        console.log(Messages.WaitingToFinalize(hash));
        const { logs } = await wait();

        const parsedLogs = masa.contracts.parseLogs(logs);

        {
          let tokenId: string | undefined;

          const soulnameTransferEvent = parsedLogs.find(
            (event: LogDescription) => event.name === "Transfer"
          );

          if (soulnameTransferEvent) {
            if (masa.config.verbose) {
              console.info({ soulnameTransferEvent });
            }

            tokenId = soulnameTransferEvent.args.tokenId.toString();
            console.log(`SoulName with ID: '${tokenId}' created.`);
          }

          if (!tokenId) {
            return {
              success: true,
              message: "",
              errorCode: SoulNameErrorCodes.NoError,
              tokenId,
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

export const createSoulName = async (
  masa: Masa,
  paymentMethod: PaymentMethod,
  soulName: string,
  duration: number,
  receiver?: string
): Promise<CreateSoulNameResult> => {
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

    const { identityId } = await masa.identity.load();
    if (!identityId) return result;

    return await purchaseSoulName(
      masa,
      paymentMethod,
      soulName,
      length,
      duration,
      receiver
    );
  } else {
    result.message = Messages.NotLoggedIn();
    console.error(result.message);
  }

  return result;
};
