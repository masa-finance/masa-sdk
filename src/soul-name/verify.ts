import Masa from "../masa";
import { ethers } from "ethers";
import { loadSoulNameByName } from "./list";
import { recoverAddress } from "../utils";

const minters = ["0x3c8D9f130970358b7E8cbc1DbD0a1EbA6EBE368F"];
const arAccounts = ["8sHnZwikWp6x2wWC7PoACl_froaXS6ECBkpjFLUeN_U"];

export const verifyByName = async (masa: Masa, soulName: string) => {
  const result = {
    nameMatch: false,
    imageHashMatch: false,
    imageSignatureMatch: false,
    metadataSignatureMatch: false,
  };

  let soulNameInstance;
  try {
    soulNameInstance = await loadSoulNameByName(masa, soulName);
  } catch (err: any) {
    console.error("Name not found", err.message);
    return result;
  }

  // todo add arweave address matches

  if (soulNameInstance) {
    result.nameMatch =
      soulNameInstance.tokenDetails.sbtName === soulNameInstance.metadata?.name;

    const imageTxId = soulNameInstance.metadata?.image?.replace("ar://", "");

    if (imageTxId) {
      const imageData = (await masa.arweave.transactions
        .getData(imageTxId, {
          decode: true,
        })
        .catch(() => {
          // ignore
        })) as Uint8Array;

      const imageHash = ethers.utils.keccak256(imageData);

      result.imageHashMatch =
        imageHash === soulNameInstance.metadata?.imageHash;

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

    if (soulNameInstance.metadata?.signature) {
      const m = { ...soulNameInstance.metadata };
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
