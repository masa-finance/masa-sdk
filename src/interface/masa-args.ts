import { ApiConfig as ArweaveConfig } from "arweave/node/lib/api";
import { Signer } from "ethers";

import { IIdentityContracts } from "./contracts";
import { EnvironmentName } from "./environment-name";
import { NetworkName } from "./network-name";

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
