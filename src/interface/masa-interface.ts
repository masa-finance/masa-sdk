import { MasaAccount } from "../account";
import { MasaContracts } from "../contracts";
import { MasaCreditScore } from "../credit-score";
import { MasaGreen } from "../green";
import { MasaIdentity } from "../identity";
import { MasaASBT, MasaSBTs, MasaSSSBT } from "../sbt";
import { MasaSession } from "../session";
import { MasaSoulName } from "../soul-name";
import { MasaArweave, MasaClient } from "../utils";
import { MasaConfig } from "./masa";

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
