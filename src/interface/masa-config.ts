import { NetworkName } from "./network-name";
import { Network } from "../utils";
import { Signer } from "ethers";

export interface MasaConfig {
  readonly apiUrl: string;
  readonly environment: string;
  readonly networkName: NetworkName;
  readonly network?: Network;
  readonly signer: Signer;
  readonly verbose: boolean;
}