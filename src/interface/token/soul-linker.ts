export interface IPassport {
  tokenId: string;
  readerIdentityId: string;
  signature: string;
  signatureDate: number;
  expirationDate: number;
}
