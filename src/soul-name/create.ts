import { LogDescription } from "@ethersproject/abi";
import Masa from "../masa";
import {
  CreateSoulNameResult,
  isSoulNameMetadataStoreResult,
  PaymentMethod,
  SoulNameErrorCodes,
  SoulNameMetadataStoreResult,
  SoulNameResultBase,
} from "../interface";
import { Messages } from "../utils";

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

  const [extension, isAvailable] = await Promise.all([
    masa.contracts.instances.SoulNameContract.extension(),
    masa.contracts.soulName.isAvailable(soulName),
  ]);

  if (isAvailable) {
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
            const { args: soulnameTransferEventArgs } = soulnameTransferEvent;
            if (masa.config.verbose) {
              console.dir({ soulnameTransferEventArgs }, { depth: null });
            }

            tokenId = soulnameTransferEventArgs.tokenId.toString();
            console.log(`SoulName with ID: '${tokenId}' created.`);
          }

          if (tokenId) {
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
    result.message = `Soulname ${soulName}${extension} already taken.`;
    result.errorCode = SoulNameErrorCodes.SoulNameError;
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
    if (
      !masa.contracts.instances.SoulStoreContract.hasAddress ||
      !masa.contracts.instances.SoulNameContract.hasAddress
    ) {
      result.message = Messages.ContractNotDeployed(masa.config.networkName);
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

    const { identityId, address } = await masa.identity.load();
    if (!identityId) {
      result.message = Messages.NoIdentity(address);
      return result;
    }

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
  }

  return result;
};
