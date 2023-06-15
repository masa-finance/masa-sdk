import type { MasaContracts } from "../contracts";
import type {
  MasaAccount,
  MasaASBT,
  MasaCreditScore,
  MasaGreen,
  MasaIdentity,
  MasaSBTBase,
  MasaSession,
  MasaSoulName,
  MasaSSSBT,
} from "../modules";
import type { MasaArweave, MasaClient } from "../utils";
import type { MasaConfig } from "./masa-config";

export interface MasaInterface {
  readonly config: MasaConfig;
  readonly arweave: MasaArweave;
  readonly client: MasaClient;
  readonly contracts: MasaContracts;
  readonly account: MasaAccount;
  readonly session: MasaSession;
  readonly identity: MasaIdentity;
  readonly soulName: MasaSoulName;
  readonly creditScore: MasaCreditScore;
  readonly green: MasaGreen;
  readonly sbt: MasaSBTBase;
  readonly asbt: MasaASBT;
  readonly sssbt: MasaSSSBT;
  readonly utils: {
    readonly version: () => { sdkVersion: string; contractsVersion: string };
  };
}
