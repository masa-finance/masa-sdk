import { BigNumber } from "@ethersproject/bignumber";
import type { Contract } from "ethers";

import { BaseErrorCodes, Messages } from "../../collections";
import type {
  BaseResult,
  IPassport,
  MasaInterface,
  PaymentMethod,
} from "../../interface";
import { logger, patchMetadataUrl } from "../../utils";
import { parsePassport } from "./parse-passport";

export type QueryLinkResult = BaseResult;

export const queryLink = async (
  masa: MasaInterface,
  contract: Contract,
  paymentMethod: PaymentMethod,
  tokenId: BigNumber,
  readerIdentityId: BigNumber,
  signature: string,
  signatureDate: number,
  expirationDate: number,
): Promise<QueryLinkResult> => {
  const result: QueryLinkResult = {
    success: false,
    errorCode: BaseErrorCodes.UnknownError,
  };

  const { identityId, address } = await masa.identity.load();

  if (!identityId) {
    result.message = Messages.NoIdentity(address);
    result.errorCode = BaseErrorCodes.DoesNotExist;
    return result;
  }

  if (identityId.toString() !== readerIdentityId.toString()) {
    result.message = `Reader identity mismatch! This passport was issued for ${readerIdentityId.toString()}`;
    logger("error", result);

    return result;
  }

  let ownerAddress;
  const { identityId: ownerIdentityId } = await masa.identity.load(
    (ownerAddress = await contract.ownerOf(tokenId)),
  );

  if (!ownerIdentityId) {
    result.message = "Owner identity not found";
    result.errorCode = BaseErrorCodes.NotFound;
    logger("error", result);

    return result;
  }

  logger(
    "log",
    `Querying link for '${await contract.name()}' (${
      contract.address
    }) ID: ${tokenId.toString()}`,
  );
  logger(
    "log",
    `from Identity ${ownerIdentityId.toString()} (${ownerAddress})`,
  );
  logger("log", `to Identity ${readerIdentityId.toString()} (${address})\n`);

  const txHash = await masa.contracts.soulLinker.addLink(
    contract.address,
    paymentMethod,
    readerIdentityId,
    ownerIdentityId,
    tokenId,
    signatureDate,
    expirationDate,
    signature,
  );

  logger("log", `tx hash for middleware ${txHash}`);

  const { "tokenURI(uint256)": tokenURI } = contract;

  const tokenUri = patchMetadataUrl(masa, await tokenURI(tokenId));

  logger("dir", { tokenUri });

  result.success = true;
  delete result.errorCode;

  return result;
};

export const queryLinkFromPassport = async (
  masa: MasaInterface,
  paymentMethod: PaymentMethod,
  contract: Contract,
  passport: string,
) => {
  const unpackedPassport: IPassport = parsePassport(passport);

  return await queryLink(
    masa,
    contract,
    paymentMethod,
    BigNumber.from(unpackedPassport.tokenId),
    BigNumber.from(unpackedPassport.readerIdentityId),
    unpackedPassport.signature,
    unpackedPassport.signatureDate,
    unpackedPassport.expirationDate,
  );
};
