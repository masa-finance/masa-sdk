import { Connection, Keypair } from "@solana/web3.js";
import type { Signer } from "ethers";

import type { Network } from "./network";
import type { NetworkName } from "./network-name";

export interface MasaConfig {
  readonly apiUrl: string;
  readonly environment: string;
  readonly networkName: NetworkName;
  readonly network?: Network;
  readonly signer:
    | Signer
    | {
        keypair: Keypair;
        connection: Connection;
      };
  readonly verbose: boolean;
  readonly forceTransactions: boolean;
}
