import { MasaAccount } from "../account/account";
import { MasaContracts } from "../contracts";
import { MasaCreditScore } from "../credit-score/credit-score";
import { MasaGreen } from "../green/green";
import { MasaIdentity } from "../identity/identity";
import { MasaASBT } from "../sbt/ASBT";
import { MasaSBTs } from "../sbt/sbt";
import { MasaSSSBT } from "../sbt/SSSBT";
import { MasaSession } from "../session/session";
import { MasaSoulName } from "../soul-name/soul-name";
import { MasaArweave, MasaClient } from "../utils";
import { MasaConfig } from "./masa-config";

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
