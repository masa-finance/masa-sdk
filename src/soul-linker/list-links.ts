import type { SoulLinker } from "@masa-finance/masa-contracts-identity";
import type { BigNumber, Contract } from "ethers";

import { Messages } from "../collections";
import type { BaseResult, MasaInterface } from "../interface";

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
  masa: MasaInterface,
  contract: Contract,
  tokenId: BigNumber
): Promise<Link[]> => {
  const result = [];

  const links: SoulLinker.LinkKeyStructOutput[] =
    await masa.contracts.instances.SoulLinkerContract.getLinks(
      contract.address,
      tokenId
    );

  for (const link of links) {
    const linkInfo: SoulLinker.LinkDataStructOutput =
      await masa.contracts.instances.SoulLinkerContract.getLinkInfo(
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
  masa: MasaInterface,
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
    result.message = Messages.NoIdentity(address);
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

  let index = 1;
  for (const linkDetail of result.links) {
    console.log(`\nLink #${index}`);
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
    index++;
  }

  if (result.links.length === 0) {
    result.message = `No link for ${tokenId.toString()}`;
    console.error(result.message);
    return result;
  }

  result.success = true;

  return result;
};
