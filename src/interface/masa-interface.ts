import type { MasaAccount } from "../account";
import type { MasaContracts } from "../contracts";
import type { MasaCreditScore } from "../credit-score";
import type { MasaGreen } from "../green";
import type { MasaIdentity } from "../identity";
import type { MasaASBT, MasaSBTs, MasaSSSBT } from "../sbt";
import type { MasaSession } from "../session";
import type { MasaSoulName } from "../soul-name";
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
