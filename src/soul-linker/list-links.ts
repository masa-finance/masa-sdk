import Masa from "../masa";
import { BigNumber, Contract } from "ethers";
import { BaseResult } from "../interface";
import { SoulLinker } from "@masa-finance/masa-contracts-identity";
import { ErrorMessage } from "../utils";

export type Link = {
  readerIdentityId: BigNumber;
  signatureDate: BigNumber;
  exists: boolean;
  ownerIdentityId: BigNumber;
  expirationDate: BigNumber;
  isRevoked: boolean;
};

export type ListLinksResult = BaseResult & {
  links: Link[];
};

export const loadLinks = async (
  masa: Masa,
  contract: Contract,
  tokenId: BigNumber
): Promise<Link[]> => {
  const result = [];

  const links: SoulLinker.LinkKeyStructOutput[] =
    await masa.contracts.identity.SoulLinkerContract.getLinks(
      contract.address,
      tokenId
    );

  for (const link of links) {
    const linkInfo: SoulLinker.LinkDataStructOutput =
      await masa.contracts.identity.SoulLinkerContract.getLinkInfo(
        contract.address,
        tokenId,
        link.readerIdentityId,
        link.signatureDate
      );

    result.push({
      ...linkInfo,
      ...link,
    });
  }

  return result;
};

export const listLinks = async (
  masa: Masa,
  contract: Contract,
  tokenId: BigNumber
): Promise<ListLinksResult> => {
  const result: ListLinksResult = {
    success: false,
    message: "Unknown Error",
    links: [],
  };

  const { identityId, address } = await masa.identity.load();

  if (!identityId) {
    result.message = ErrorMessage.NoIdentity(address);
    return result;
  }

  console.log(
    `Listing links for '${await contract.name()}' (${
      contract.address
    }) ID: ${tokenId.toString()}`
  );

  try {
    await contract.ownerOf(tokenId);
  } catch {
    console.error(`Token ${tokenId.toString()} does not exist!`);
    return result;
  }

  result.links = await loadLinks(masa, contract, tokenId);

  let x = 1;
  for (const linkDetail of result.links) {
    console.log(`\nLink #${x}`);
    console.log(
      "Owner Identity",
      linkDetail.ownerIdentityId.toString(),
      linkDetail.ownerIdentityId.toString() === identityId.toString()
        ? "(you)"
        : ""
    );
    console.log(
      "Reader Identity",
      linkDetail.readerIdentityId.toString(),
      linkDetail.readerIdentityId.toString() === identityId.toString()
        ? "(you)"
        : ""
    );
    console.log(
      "Signature Date",
      new Date(linkDetail.signatureDate.toNumber() * 1000).toUTCString(),
      linkDetail.signatureDate.toNumber()
    );
    console.log(
      "Expiration Date",
      new Date(linkDetail.expirationDate.toNumber() * 1000).toUTCString(),
      linkDetail.expirationDate.toNumber()
    );
    console.log(
      `Link expired?: ${
        new Date() > new Date(linkDetail.expirationDate.toNumber() * 1000)
          ? "Yes"
          : "No"
      }`
    );
    console.log(`Link exists?: ${linkDetail.exists ? "Yes" : "No"}`);
    console.log(`Link revoked?: ${linkDetail.isRevoked ? "Yes" : "No"}`);
    x++;
  }

  if (result.links.length === 0) {
    result.message = `No link for ${tokenId.toString()}`;
    console.error(result.message);
    return result;
  }

  result.success = true;

  return result;
};
