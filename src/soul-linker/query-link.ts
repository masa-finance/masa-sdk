import { BigNumber, Contract } from "ethers";

import { patchMetadataUrl } from "../helpers";
import type {
  BaseResult,
  IPassport,
  MasaInterface,
  PaymentMethod,
} from "../interface";
import { Messages } from "../utils";
import { parsePassport } from "./parse-passport";

export type QueryLinkResult = BaseResult;

export const queryLinkFromPassport = async (
  masa: MasaInterface,
  paymentMethod: PaymentMethod,
  contract: Contract,
  passport: string
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
    unpackedPassport.expirationDate
  );
};

export const queryLink = async (
  masa: MasaInterface,
  contract: Contract,
  paymentMethod: PaymentMethod,
  tokenId: BigNumber,
  readerIdentityId: BigNumber,
  signature: string,
  signatureDate: number,
  expirationDate: number
): Promise<QueryLinkResult> => {
  const result: QueryLinkResult = {
    success: false,
    message: "Unknown Error",
  };

  const { identityId, address } = await masa.identity.load();
  if (!identityId) {
    result.message = Messages.NoIdentity(address);
    return result;
  }

  if (identityId.toString() !== readerIdentityId.toString()) {
    result.message = `Reader identity mismatch! This passport was issued for ${readerIdentityId.toString()}`;
    console.error(result.message);
    return result;
  }

  let ownerAddress;
  const { identityId: ownerIdentityId } = await masa.identity.load(
    (ownerAddress = await contract.ownerOf(tokenId))
  );

  if (!ownerIdentityId) {
    console.error("Owner identity not found");
    return result;
  }

  console.log(
    `Querying link for '${await contract.name()}' (${
      contract.address
    }) ID: ${tokenId.toString()}`
  );
  console.log(`from Identity ${ownerIdentityId.toString()} (${ownerAddress})`);
  console.log(`to Identity ${readerIdentityId.toString()} (${address})\n`);

  const txHash = await masa.contracts.soulLinker.addLink(
    contract.address,
    paymentMethod,
    readerIdentityId,
    ownerIdentityId,
    tokenId,
    signatureDate,
    expirationDate,
    signature
  );

  console.log("tx hash for middleware", txHash);

  const { "tokenURI(uint256)": tokenURI } = contract;

  const tokenUri = patchMetadataUrl(masa, await tokenURI(tokenId));

  console.log({ tokenUri });

  result.success = true;

  return result;
};
