import { version as contractsVersion } from "@masa-finance/masa-contracts-identity/package.json";

import { version as sdkVersion } from "../../package.json";

export const version = () => {
  return {
    contractsVersion,
    sdkVersion,
  };
};
