import Masa from "../masa";
import { signSoulLinkerLink } from "../helpers";
import { BigNumber, Contract } from "ethers";
import { BaseResult, IPassport } from "../interface";
import { loadAddressFromIdentityId } from "../identity";
import { ErrorMessage } from "../utils";

export type CreateLinkResult = BaseResult & { passport?: string };

export const createLink = async (
  masa: Masa,
  contract: Contract,
  tokenId: BigNumber,
  readerIdentityId: BigNumber
): Promise<CreateLinkResult> => {
  const result: CreateLinkResult = {
    success: false,
    message: "Unknown Error",
  };

  const { identityId, address } = await masa.identity.load();

  if (!identityId) {
    result.message = ErrorMessage.NoIdentity(address);
    return result;
  }

  const receiverAddress = await loadAddressFromIdentityId(
    masa,
    readerIdentityId
  );

  if (!receiverAddress) {
    result.message = `Receiver identity not found! ${readerIdentityId}`;
    return result;
  }

  console.log(
    `Creating link for '${await contract.name()}' (${
      contract.address
    }) ID: ${tokenId.toString()}`
  );
  console.log(`from Identity ${identityId.toString()} (${address})`);
  console.log(
    `to Identity ${readerIdentityId.toString()} (${receiverAddress})\n`
  );

  const now = Date.now();
  const currentDate = new Date(now);
  const { signature, signatureDate, expirationDate } = await signSoulLinkerLink(
    masa,
    readerIdentityId,
    identityId,
    contract.address,
    tokenId,
    Math.floor(now / 1000),
    // 1 day
    24 * 60 * 60
  );

  console.log(`Signature Date: ${currentDate.toUTCString()}`);
  console.log(
    `Expiration Date: ${new Date(expirationDate * 1000).toUTCString()}`
  );

  const passport: IPassport = {
    signature,
    signatureDate,
    expirationDate,
    tokenId: tokenId.toString(),
    readerIdentityId: readerIdentityId.toString(),
  };

  result.passport = btoa(JSON.stringify(passport, null, 2));
  console.log("\nLink passport:", result.passport, "\n");

  result.success = true;

  return result;
};
