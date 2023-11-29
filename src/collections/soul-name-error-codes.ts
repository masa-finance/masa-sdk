export enum BaseErrorCodes {
  NoError,
  NetworkError,
  InsufficientFunds,
  RejectedTransaction,
  GeneralGasIssue,
  UnknownError = 1337,
}

export enum SoulNameErrorCodes {
  ArweaveError,
  SoulNameError,
}

export type CreateSoulNameErrorCodes = SoulNameErrorCodes | BaseErrorCodes;
