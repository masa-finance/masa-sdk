import Masa from "../masa";
import { ethers } from "ethers";
import { loadSoulNameByName } from "./list";
import { recoverAddress } from "../utils";

const minters = [
  // goerli service account
  "0x3c8D9f130970358b7E8cbc1DbD0a1EbA6EBE368F",
];
const arAccounts = [
  // testnet image creator account
  "8sHnZwikWp6x2wWC7PoACl_froaXS6ECBkpjFLUeN_U",
];

export const verifyByName = async (
  masa: Masa,
  soulName: string
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

  let soulNameInstance;
  try {
    soulNameInstance = await loadSoulNameByName(masa, soulName);
  } catch (err: any) {
    console.error("Name not found", err.message);
    return result;
  }

  if (soulNameInstance) {
    // check if name matches onchain and in the metadata
    result.nameMatch =
      soulNameInstance.tokenDetails.sbtName === soulNameInstance.metadata?.name;

    // check if metadata was deployed to arweave by masa
    const metadataTxId = soulNameInstance.tokenUri.replace("ar://", "");

    if (metadataTxId) {
      const metadataTxData = await masa.arweave.transactions.get(metadataTxId);
      const metadataOwner = await masa.arweave.wallets.ownerToAddress(
        metadataTxData.owner
      );
      result.metadataOwnerIsMasaAccount =
        !!metadataOwner && arAccounts.indexOf(metadataOwner) > -1;
    }

    const imageTxId = soulNameInstance.metadata?.image?.replace("ar://", "");

    if (imageTxId) {
      // check if image data was deployed to arweave by masa
      const imageTxData = await masa.arweave.transactions.get(imageTxId);
      const imageDataOwner = await masa.arweave.wallets.ownerToAddress(
        imageTxData.owner
      );
      result.imageOwnerIsMasaAccount =
        !!imageDataOwner && arAccounts.indexOf(imageDataOwner) > -1;

      const imageData = (await masa.arweave.transactions
        .getData(imageTxId, {
          decode: true,
        })
        .catch(() => {
          // ignore
        })) as Uint8Array;

      const imageHash = ethers.utils.keccak256(imageData);

      // check if image data hash matches the hash from the metadata
      result.imageHashMatch =
        imageHash === soulNameInstance.metadata?.imageHash;

      // check that image hash signature matches one of the masa addresses
      if (soulNameInstance.metadata?.imageHashSignature) {
        const recoveredImageAddress = recoverAddress(
          imageHash,
          soulNameInstance.metadata.imageHashSignature
        );

        result.imageSignatureMatch =
          !!recoveredImageAddress &&
          minters.indexOf(recoveredImageAddress) > -1;
      }
    }

    // check that metadata signature matches one of the masa addresses
    if (soulNameInstance.metadata?.signature) {
      const m = { ...soulNameInstance.metadata };

      // we need to remove the signature before we can verify because the signature
      // was created without
      m.signature = "";

      const recoveredMetadataAddress = recoverAddress(
        JSON.stringify(m, null, 2),
        soulNameInstance.metadata.signature
      );

      result.metadataSignatureMatch =
        !!recoveredMetadataAddress &&
        minters.indexOf(recoveredMetadataAddress) > -1;
    }
  }

  return result;
};
