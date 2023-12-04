export enum BaseErrorCodes {
  /**
   * @description General Network related Error
   */
  NetworkError = "NetworkError",
  /**
   * @description General funds related issues
   */
  InsufficientFunds = "InsufficientFunds",
  /**
   * @description General Transaction related issues
   */
  RejectedTransaction = "RejectedTransaction",
  TransactionFailed = "TransactionFailed",
  /**
   * @description General Gas Related issues
   */
  GeneralGasIssue = "GeneralGasIssue",
  EstimateGasFailed = "EstimateGasFailed",
  /**
   * @description General Errors
   */
  LimitOutOfBounds = "LimitOutOfBounds",
  AlreadyExists = "AlreadyExists",
  DoesNotExist = "DoesNotExist",
  NotFound = "NotFound",
  /**
   * @description Unknown Error
   */
  UnknownError = 1337,
}
