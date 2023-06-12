import { ApiConfig as ArweaveConfig } from "arweave/node/lib/api";
import { Signer } from "ethers";

import type { IIdentityContracts } from "./contracts";
import type { EnvironmentName } from "./environment-name";
import type { NetworkName } from "./network-name";

export interface MasaArgs {
  cookie?: string;
  signer: Signer;
  apiUrl?: string;
  environment?: EnvironmentName;
  networkName?: NetworkName;
  verbose?: boolean;
  arweave?: ArweaveConfig;
  contractOverrides?: Partial<IIdentityContracts>;
}
