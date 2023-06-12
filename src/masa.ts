import { MasaAccount } from "./account";
import { MasaContracts } from "./contracts";
import { MasaCreditScore } from "./credit-score";
import { MasaGreen } from "./green";
import { version } from "./helpers";
import { MasaIdentity } from "./identity";
import { MasaArgs, MasaConfig, MasaInterface } from "./interface";
import { MasaASBT, MasaSBTs, MasaSSSBT } from "./sbt";
import { MasaSession } from "./session";
import { MasaSoulName } from "./soul-name";
import { MasaArweave, MasaClient, SupportedNetworks } from "./utils";

export class Masa implements MasaInterface {
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
