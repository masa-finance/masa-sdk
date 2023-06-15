import { ApiConfig as ArweaveConfig } from "arweave/node/lib/api";
import { Signer } from "ethers";

import type { IIdentityContracts } from "./contracts";
import type { EnvironmentName } from "./environment-name";
import type { NetworkName } from "./network-name";

export interface MasaArgs {
  readonly signer: Signer;
  readonly cookie?: string;
  readonly apiUrl?: string;
  readonly environment?: EnvironmentName;
  readonly networkName?: NetworkName;
  readonly verbose?: boolean;
  readonly arweave?: ArweaveConfig;
  readonly contractOverrides?: Partial<IIdentityContracts>;
}
