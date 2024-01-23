import { ILinkableSBT, MasaSBT } from "@masa-finance/masa-contracts-identity";
import type { BigNumber } from "ethers";

import { BaseErrorCodes, Messages } from "../../collections";
import type { BaseResult, IPassport, MasaInterface } from "../../interface";
import { logger } from "../../utils";
import { resolveIdentity } from "../identity/resolve";

export type CreateLinkResult = BaseResult & { passport?: string };

export const createLink = async (
  masa: MasaInterface,
  contract: ILinkableSBT & MasaSBT,
  tokenId: BigNumber,
  readerIdentityId: BigNumber,
): Promise<CreateLinkResult> => {
  const result: CreateLinkResult = {
    success: false,
    errorCode: BaseErrorCodes.UnknownError,
  };

  const { identityId, address } = await masa.identity.load();

  if (!identityId) {
    result.message = Messages.NoIdentity(address);
    return result;
  }

  const receiverAddress = await resolveIdentity(masa, readerIdentityId);

  if (!receiverAddress) {
    result.message = `Receiver identity not found! ${readerIdentityId.toNumber()}`;
    result.errorCode = BaseErrorCodes.NotFound;
    return result;
  }

  logger(
    "log",
    `Creating link for '${await contract.name()}' (${
      contract.address
    }) ID: ${tokenId.toString()}`,
  );
  logger("log", `from Identity ${identityId.toString()} (${address})`);
  logger(
    "log",
    `to Identity ${readerIdentityId.toString()} (${receiverAddress})\n`,
  );

  const now = Date.now();
  const currentDate = new Date(now);
  const { signature, signatureDate, expirationDate } =
    await masa.contracts.soulLinker.signLink(
      readerIdentityId,
      identityId,
      contract.address,
      tokenId,
      Math.floor(now / 1000),
      // 1 day
      24 * 60 * 60,
    );

  logger("log", `Signature Date: ${currentDate.toUTCString()}`);
  logger(
    "log",
    `Expiration Date: ${new Date(expirationDate * 1000).toUTCString()}`,
  );

  const passport: IPassport = {
    signature,
    signatureDate,
    expirationDate,
    tokenId: tokenId.toString(),
    readerIdentityId: readerIdentityId.toString(),
  };

  result.passport = btoa(JSON.stringify(passport, null, 2));
  logger("log", `Link passport: ${JSON.stringify(passport)}\n`);

  result.success = true;
  delete result.errorCode;

  return result;
};
