import Masa from "../masa";
import { BaseResult } from "../interface";
import { BigNumber, Contract } from "ethers";
import { Link, loadLinks } from "./list-links";
import { Messages } from "../utils";

export type BreakLinkResult = BaseResult;

export const breakLink = async (
  masa: Masa,
  contract: Contract,
  tokenId: BigNumber,
  readerIdentityId: BigNumber
): Promise<BreakLinkResult> => {
  const result: BreakLinkResult = {
    success: false,
    message: "Unknown Error",
  };

  const { identityId, address } = await masa.identity.load();
  if (!identityId) {
    result.message = Messages.NoIdentity(address);
    return result;
  }

  if (!identityId) {
    console.error("Owner identity not found");
    return result;
  }

  const links = await loadLinks(masa, contract, tokenId);

  console.log({ links, readerIdentityId });

  const filteredLinks = links.filter(
    (link: Link) =>
      link.readerIdentityId.toString() === readerIdentityId.toString() &&
      link.exists &&
      !link.isRevoked
  );

  console.log({ filteredLinks });
  for (const link of filteredLinks) {
    console.log(`Breaking link ${JSON.stringify(link, undefined, 2)}`);
    const response = await masa.contracts.instances.SoulLinkerContract.connect(
      masa.config.wallet
    ).revokeLink(
      readerIdentityId,
      identityId,
      contract.address,
      tokenId,
      link.signatureDate
    );

    const tx = await response.wait();
    console.log(tx.transactionHash);
  }

  return result;
};
