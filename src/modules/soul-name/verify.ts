import { utils } from "ethers";

import type { MasaInterface } from "../../interface";
import { recoverAddress } from "../../utils";

const minters = [
  // testnets service account
  "0x3c8D9f130970358b7E8cbc1DbD0a1EbA6EBE368F",
  // mainnets service account
  "0x5b45dAA4645F79a419811dc0657FA1b2695c6Ab7",
];
const arAccounts = [
  // testnets image creator account
  "8sHnZwikWp6x2wWC7PoACl_froaXS6ECBkpjFLUeN_U",
  // mainnets image creator account
  "xDKpdiZ7H9n_SsdX_CMpkybMGIdin5AUciM00mQgxRE",
];

export const verifyByName = async (
  masa: MasaInterface,
  soulName: string,
): Promise<{
  nameMatch: boolean;
  imageOwnerIsMasaAccount: boolean;
  imageHashMatch: boolean;
  imageSignatureMatch: boolean;
  metadataSignatureMatch: boolean;
  metadataOwnerIsMasaAccount: boolean;
}> => {
  const result = {
    nameMatch: false,
    imageOwnerIsMasaAccount: false,
    imageHashMatch: false,
    imageSignatureMatch: false,
    metadataSignatureMatch: false,
    metadataOwnerIsMasaAccount: false,
  };

  const soulNameInstance = await masa.soulName.loadSoulNameByName(soulName);

  if (soulNameInstance) {
    // check if name matches on-chain and in the metadata
    result.nameMatch =
      soulNameInstance.tokenDetails.sbtName === soulNameInstance.metadata?.name;

    // check if metadata was deployed to arweave by masa
    const soulNameMetadataTxId = soulNameInstance.tokenUri
      .replace("ar://", "")
      .replace("https://arweave.net/", "");

    if (soulNameMetadataTxId) {
      try {
        const metadataTxData =
          await masa.arweave.transactions.get(soulNameMetadataTxId);
        const metadataOwner = await masa.arweave.wallets.ownerToAddress(
          metadataTxData.owner,
        );
        result.metadataOwnerIsMasaAccount =
          Boolean(metadataOwner) && arAccounts.indexOf(metadataOwner) > -1;
      } catch {
        console.error(
          "Failed to load metadata transaction!",
          soulNameMetadataTxId,
        );
      }
    }

    const imageTxId = soulNameInstance.metadata?.image
      ?.replace("ar://", "")
      .replace("https://arweave.net/", "");

    if (imageTxId) {
      try {
        // check if image data was deployed to arweave by masa
        const imageTxData = await masa.arweave.transactions.get(imageTxId);
        const imageDataOwner = await masa.arweave.wallets.ownerToAddress(
          imageTxData.owner,
        );
        result.imageOwnerIsMasaAccount =
          Boolean(imageDataOwner) && arAccounts.indexOf(imageDataOwner) > -1;
      } catch {
        console.error("Failed to load image transaction!", imageTxId);
      }

      try {
        const imageData = (await masa.arweave.loadTransactionData(
          imageTxId,
          false,
        )) as Uint8Array;

        const imageHash = utils.keccak256(imageData);

        // check if image data hash matches the hash from the metadata
        result.imageHashMatch =
          imageHash === soulNameInstance.metadata?.imageHash;

        // check that image hash signature matches one of the masa addresses
        if (soulNameInstance.metadata?.imageHashSignature) {
          const recoveredImageAddress = recoverAddress(
            imageHash,
            soulNameInstance.metadata.imageHashSignature,
          );

          result.imageSignatureMatch = Boolean(
            recoveredImageAddress &&
              minters.indexOf(recoveredImageAddress) > -1,
          );
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Failed to load image data!", imageTxId, error.message);
        }
      }
    }

    // check that metadata signature matches one of the masa addresses
    if (soulNameInstance.metadata?.signature) {
      const metadata = { ...soulNameInstance.metadata };

      // we need to remove the signature before we can verify because the signature
      // was created without
      metadata.signature = "";

      const recoveredMetadataAddress = recoverAddress(
        JSON.stringify(metadata, null, 2),
        soulNameInstance.metadata.signature,
      );

      result.metadataSignatureMatch = Boolean(
        recoveredMetadataAddress &&
          minters.indexOf(recoveredMetadataAddress) > -1,
      );
    }
  } else {
    console.error(`Soul Name '${soulName}' not found!`);
  }

  return result;
};
