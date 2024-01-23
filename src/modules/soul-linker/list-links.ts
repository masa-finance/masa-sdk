import type {
  ILinkableSBT,
  MasaSBT,
  SoulLinker,
} from "@masa-finance/masa-contracts-identity";
import type { BigNumber, Contract } from "ethers";

import { BaseErrorCodes, Messages } from "../../collections";
import type { BaseResult, MasaInterface } from "../../interface";
import { logger } from "../../utils";

export interface Link {
  readerIdentityId: BigNumber;
  signatureDate: BigNumber;
  exists: boolean;
  ownerIdentityId: BigNumber;
  expirationDate: BigNumber;
  isRevoked: boolean;
}

export type ListLinksResult = BaseResult & {
  links: Link[];
};

export const loadLinks = async (
  masa: MasaInterface,
  contract: Contract,
  tokenId: BigNumber,
): Promise<Link[]> => {
  const result = [];

  const links: SoulLinker.LinkKeyStructOutput[] =
    await masa.contracts.instances.SoulLinkerContract.getLinks(
      contract.address,
      tokenId,
    );

  for (const link of links) {
    const linkInfo: SoulLinker.LinkDataStructOutput =
      await masa.contracts.instances.SoulLinkerContract.getLinkInfo(
        contract.address,
        tokenId,
        link.readerIdentityId,
        link.signatureDate,
      );

    result.push({
      ...linkInfo,
      ...link,
    });
  }

  return result;
};

export const listLinks = async (
  masa: MasaInterface,
  contract: ILinkableSBT & MasaSBT,
  tokenId: BigNumber,
): Promise<ListLinksResult> => {
  const result: ListLinksResult = {
    success: false,
    errorCode: BaseErrorCodes.UnknownError,
    links: [],
  };

  const { identityId, address } = await masa.identity.load();

  if (!identityId) {
    result.message = Messages.NoIdentity(address);
    result.errorCode = BaseErrorCodes.DoesNotExist;
    return result;
  }

  logger(
    "log",
    `Listing links for '${await contract.name()}' (${
      contract.address
    }) ID: ${tokenId.toString()}`,
  );

  try {
    const { ownerOf } = contract;
    await ownerOf(tokenId);
  } catch (error: unknown) {
    result.message = `Token ${tokenId.toString()} does not exist!`;
    result.errorCode = BaseErrorCodes.DoesNotExist;
    logger("error", result);

    return result;
  }

  result.links = await loadLinks(masa, contract, tokenId);

  let index = 1;
  for (const linkDetail of result.links) {
    logger("log", `\nLink #${index}`);
    logger(
      "error",
      `Owner Identity ${linkDetail.ownerIdentityId.toString()} ${
        linkDetail.ownerIdentityId.toString() === identityId.toString()
          ? "(you)"
          : ""
      }`,
    );
    logger(
      "error",
      `Reader Identity ${linkDetail.readerIdentityId.toString()} ${
        linkDetail.readerIdentityId.toString() === identityId.toString()
          ? "(you)"
          : ""
      }`,
    );
    logger(
      "error",
      `Signature Date ${new Date(
        linkDetail.signatureDate.toNumber() * 1000,
      ).toUTCString()} ${linkDetail.signatureDate.toNumber()}`,
    );
    logger(
      "error",
      `Expiration Date ${new Date(
        linkDetail.expirationDate.toNumber() * 1000,
      ).toUTCString()} ${linkDetail.expirationDate.toNumber()}`,
    );
    logger(
      "log",
      `Link expired?: ${
        new Date() > new Date(linkDetail.expirationDate.toNumber() * 1000)
          ? "Yes"
          : "No"
      }`,
    );
    logger("log", `Link exists?: ${linkDetail.exists ? "Yes" : "No"}`);
    logger("log", `Link revoked?: ${linkDetail.isRevoked ? "Yes" : "No"}`);
    index++;
  }

  if (result.links.length === 0) {
    result.message = `No link for ${tokenId.toString()}`;
    logger("error", result);
    return result;
  }

  result.success = true;
  delete result.errorCode;

  return result;
};
