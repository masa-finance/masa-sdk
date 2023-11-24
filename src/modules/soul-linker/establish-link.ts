import { BigNumber, Contract } from "ethers";

import { Messages } from "../../collections";
import type {
  BaseResult,
  IPassport,
  MasaInterface,
  PaymentMethod,
} from "../../interface";
import { parsePassport } from "./parse-passport";

export type EstablishLinkResult = BaseResult;

export const establishLink = async (
  masa: MasaInterface,
  paymentMethod: PaymentMethod,
  contract: Contract,
  tokenId: BigNumber,
  readerIdentityId: BigNumber,
  signature: string,
  signatureDate: number,
  expirationDate: number,
): Promise<EstablishLinkResult> => {
  const result: EstablishLinkResult = {
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
    (ownerAddress = await contract.ownerOf(tokenId)),
  );

  if (!ownerIdentityId) {
    result.message = "Owner identity not found";
    console.error(result.message);
    return result;
  }

  console.log(
    `Establishing link for '${await contract.name()}' (${
      contract.address
    }) ID: ${tokenId.toString()}`,
  );
  console.log(`from Identity ${ownerIdentityId.toString()} (${ownerAddress})`);
  console.log(`to Identity ${identityId.toString()} (${address})\n`);

  await masa.contracts.soulLinker.addLink(
    contract.address,
    paymentMethod,
    readerIdentityId,
    ownerIdentityId,
    BigNumber.from(tokenId),
    signatureDate,
    expirationDate,
    signature,
  );

  result.success = true;

  return result;
};

export const establishLinkFromPassport = async (
  masa: MasaInterface,
  paymentMethod: PaymentMethod,
  contract: Contract,
  passport: string,
) => {
  const unpackedPassport: IPassport = parsePassport(passport);

  return await establishLink(
    masa,
    paymentMethod,
    contract,
    BigNumber.from(unpackedPassport.tokenId),
    BigNumber.from(unpackedPassport.readerIdentityId),
    unpackedPassport.signature,
    unpackedPassport.signatureDate,
    unpackedPassport.expirationDate,
  );
};
