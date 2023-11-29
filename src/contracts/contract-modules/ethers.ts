import { BigNumber } from "ethers";

import { BaseErrorCodes } from "../../collections";

export const RETURN_VALUE_ERROR_CODES = {
  TRANSACTION_RAN_OUT_OF_GAS: "TRANSACTION_RAN_OUT_OF_GAS",
  TRANSACTION_UNDERPRICED: "TRANSACTION_UNDERPRICED",
  REJECTED_TRANSACTION: "REJECTED_TRANSACTION",
  CALL_REVERTED: "CALL_REVERTED",
  EXECUTION_REVERTED: "EXECUTION_REVERTED",
  NONCE_TOO_LOW: "NONCE_TOO_LOW",
  INSUFFICIENT_FUNDS_FOR_GAS: "INSUFFICIENT_FUNDS_FOR_GAS",
  MAX_PRIORITY_FEE_PER_GAS_HIGHER_THAN_MAX_FEE_PER_GAS:
    "MAX_PRIORITY_FEE_PER_GAS_HIGHER_THAN_MAX_FEE_PER_GAS",
  MAX_FEE_PER_GAS_LESS_THAN_BLOCK_BASE_FEE:
    "MAX_FEE_PER_GAS_LESS_THAN_BLOCK_BASE_FEE",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

export const ETHERS_ERROR_CODES = {
  NONCE_EXPIRED: "NONCE_EXPIRED",
  UNPREDICTABLE_GAS_LIMIT: "UNPREDICTABLE_GAS_LIMIT",
  ACTION_REJECTED: "ACTION_REJECTED",
  CALL_EXCEPTION: "CALL_EXCEPTION",
} as const;

export const NESTED_ETHERS_ERROR_CODES = {
  REJECTED_TRANSACTION: 4001,
  REQUIRE_TRANSACTION: -32603,
  ERROR_WHILE_FORMATTING_OUTPUT_FROM_RPC: -32603,
  TRANSACTION_UNDERPRICED: -32000,
} as const;

export const isEthersError = (error: unknown): error is EthersError =>
  "reason" in (error as Error);

export const parseEthersError = (
  error: unknown,
): {
  errorCode: BaseErrorCodes;
  message?: string;
} => {
  let message: string | undefined;
  let errorCode = BaseErrorCodes.UnknownError;

  if (isEthersError(error)) {
    message = error.reason;

    switch (error.code) {
      case RETURN_VALUE_ERROR_CODES.TRANSACTION_RAN_OUT_OF_GAS:
      case RETURN_VALUE_ERROR_CODES.MAX_FEE_PER_GAS_LESS_THAN_BLOCK_BASE_FEE:
      case RETURN_VALUE_ERROR_CODES.MAX_PRIORITY_FEE_PER_GAS_HIGHER_THAN_MAX_FEE_PER_GAS:
      case ETHERS_ERROR_CODES.UNPREDICTABLE_GAS_LIMIT:
        errorCode = BaseErrorCodes.GeneralGasIssue;
        break;
      case RETURN_VALUE_ERROR_CODES.INSUFFICIENT_FUNDS_FOR_GAS:
        errorCode = BaseErrorCodes.InsufficientFunds;
        break;
      case RETURN_VALUE_ERROR_CODES.REJECTED_TRANSACTION:
      case ETHERS_ERROR_CODES.ACTION_REJECTED:
        errorCode = BaseErrorCodes.RejectedTransaction;
        break;
    }

    if (errorCode === BaseErrorCodes.UnknownError && error.error) {
      switch (error.error.code) {
        case NESTED_ETHERS_ERROR_CODES.REJECTED_TRANSACTION:
          errorCode = BaseErrorCodes.RejectedTransaction;
          break;
        case NESTED_ETHERS_ERROR_CODES.REQUIRE_TRANSACTION:
          errorCode = BaseErrorCodes.NetworkError;
          break;
        case NESTED_ETHERS_ERROR_CODES.TRANSACTION_UNDERPRICED:
          errorCode = BaseErrorCodes.GeneralGasIssue;
          break;
      }
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  console.log({ errorCode });

  return {
    errorCode,
    message,
  };
};

export interface EthersError {
  code?: string | number;
  message: string;
  error?: NestedEthersError;
  transaction?: {
    gasLimit: BigNumber;
    nonce: number;
  };
  receipt?: {
    gasUsed: BigNumber;
  };
  action?: string;
  reason?: string;
}

export interface NestedEthersError {
  code?: string | number;
  message?: string;
  data?: {
    message?: string;
  };
  error?: {
    error?: {
      code?: string | number;
    };
    body?: string;
  };
}
