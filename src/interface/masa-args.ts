import { Connection, Keypair } from "@solana/web3.js";
import { ApiConfig as ArweaveConfig } from "arweave/node/lib/api";
import { Signer } from "ethers";

import type { IIdentityContracts } from "./contracts";
import type { EnvironmentName } from "./environment-name";
import type { NetworkName } from "./network-name";

export interface MasaArgs {
  readonly signer:
    | Signer
    | {
        keypair: Keypair;
        connection: Connection;
      };
  readonly networkName?: NetworkName;
  readonly cookie?: string;
  readonly apiUrl?: string;
  readonly environment?: EnvironmentName;
  readonly arweave?: ArweaveConfig;
  readonly contractOverrides?: Partial<IIdentityContracts>;
  readonly verbose?: boolean;
  readonly forceTransactions?: boolean;
}
