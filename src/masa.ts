import { SupportedNetworks } from "./collections";
import { MasaContracts } from "./contracts";
import type { MasaArgs, MasaConfig, MasaInterface } from "./interface";
import {
  MasaAccount,
  MasaASBT,
  MasaCreditScore,
  MasaGreen,
  MasaIdentity,
  MasaSBTs,
  MasaSession,
  MasaSoulName,
  MasaSSSBT,
  version,
} from "./modules";
import { MasaArweave, MasaClient } from "./utils";

export class Masa implements MasaInterface {
  // config
  readonly config: MasaConfig;
  // clients
  readonly arweave: MasaArweave;
  readonly client: MasaClient;
  // contracts
  readonly contracts: MasaContracts;
  // modules
  readonly account: MasaAccount;
  readonly session: MasaSession;
  readonly identity: MasaIdentity;
  readonly soulName: MasaSoulName;
  readonly creditScore: MasaCreditScore;
  readonly green: MasaGreen;
  readonly sbt: MasaSBTs;
  readonly asbt: MasaASBT;
  readonly sssbt: MasaSSSBT;

  public constructor({
    cookie,
    signer,
    apiUrl = "https://middleware.masa.finance",
    environment = "production",
    networkName = "ethereum",
    arweave = {
      host: "arweave.net",
      port: 443,
      protocol: "https",
    },
    contractOverrides,
    verbose = false,
  }: MasaArgs) {
    // build config
    this.config = {
      apiUrl,
      environment,
      networkName,
      network: SupportedNetworks[networkName],
      signer,
      verbose,
    };

    // masa client
    this.client = new MasaClient({
      masa: this,
      apiUrl,
      cookie,
    });

    // arweave client
    this.arweave = new MasaArweave(arweave, this.config);

    // masa contracts wrapper
    this.contracts = new MasaContracts(this, contractOverrides);
    // account + session
    this.account = new MasaAccount(this);
    this.session = new MasaSession(this);
    // identity
    this.identity = new MasaIdentity(this);
    // soul name
    this.soulName = new MasaSoulName(this);
    // credit score
    this.creditScore = new MasaCreditScore(this);
    // green
    this.green = new MasaGreen(this);
    // generic sbt handler
    this.sbt = new MasaSBTs(this);
    // ASBT handler
    this.asbt = new MasaASBT(this);
    // SSSBT Handler
    this.sssbt = new MasaSSSBT(this);
  }

  utils = {
    version,
  };
}
