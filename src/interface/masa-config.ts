import { Signer } from "ethers";

import { Network } from "../utils";
import { NetworkName } from "./network-name";

export interface MasaConfig {
  readonly apiUrl: string;
  readonly environment: string;
  readonly networkName: NetworkName;
  readonly network?: Network;
  readonly signer: Signer;
  readonly verbose: boolean;
}
