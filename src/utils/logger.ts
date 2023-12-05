import { BaseResult } from "../interface";

export const isBaseResult = (message: unknown): message is BaseResult => {
  if (typeof message === "string") {
    return false;
  }

  return "success" in (message as BaseResult);
};

export const logger = (
  method: "warn" | "error" | "log" | "info" | "dir",
  message: unknown,
): void => {
  // eslint-disable-next-line no-console
  const fn = console[method];

  if (method === "dir") {
    fn(message, { depth: null });
  } else {
    if (isBaseResult(message)) {
      message.errorCode
        ? fn(`${message.errorCode}: ${message.message}`)
        : fn(message.message);
    } else {
      fn(message);
    }
  }
};
