import type { MasaContracts } from "../contracts";
import type {
  MasaAccount,
  MasaASBT,
  MasaCreditScore,
  MasaGreen,
  MasaIdentity,
  MasaSBTs,
  MasaSession,
  MasaSoulName,
  MasaSSSBT,
} from "../modules";
import type { MasaArweave, MasaClient } from "../utils";
import type { MasaConfig } from "./masa-config";

export interface MasaInterface {
  config: MasaConfig;
  arweave: MasaArweave;
  client: MasaClient;
  contracts: MasaContracts;
  account: MasaAccount;
  session: MasaSession;
  identity: MasaIdentity;
  soulName: MasaSoulName;
  creditScore: MasaCreditScore;
  green: MasaGreen;
  sbt: MasaSBTs;
  asbt: MasaASBT;
  sssbt: MasaSSSBT;
  utils: {
    version: () => { sdkVersion: string; contractsVersion: string };
  };
}
