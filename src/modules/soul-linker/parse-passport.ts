import { IPassport } from "../../interface";

export const parsePassport = (passportEncoded: string): IPassport => {
  const passport: IPassport = JSON.parse(atob(passportEncoded)) as IPassport;
  console.log({ passport });

  if (
    !passport.tokenId ||
    !passport.readerIdentityId ||
    !passport.signature ||
    !passport.signatureDate ||
    !passport.expirationDate
  ) {
    throw new Error("Passing passport failed!");
  }

  return passport;
};
