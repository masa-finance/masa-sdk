import {
  MasaAccount,
  MasaArgs,
  MasaArweave,
  MasaClient,
  MasaConfig,
  MasaContracts,
  MasaCreditScore,
  MasaGreen,
  MasaIdentity,
  MasaSession,
  MasaSoulName,
  version,
} from "./";

export default class Masa {
  public readonly config: MasaConfig;

  public readonly arweave: MasaArweave;
  public readonly client: MasaClient;

  public readonly contracts: MasaContracts;
  public readonly account: MasaAccount;
  public readonly session: MasaSession;
  public readonly identity: MasaIdentity;
  public readonly soulName: MasaSoulName;
  public readonly creditScore: MasaCreditScore;
  public readonly green: MasaGreen;

  public constructor({
    cookie,
    wallet,
    apiUrl = "https://middleware.masa.finance",
    environment = "production",
    defaultNetwork = "ethereum",
    arweave = {
      host: "arweave.net",
      port: 443,
      protocol: "https",
    },
    verbose = false,
  }: MasaArgs) {
    // build config
    this.config = {
      apiUrl,
      environment,
      network: defaultNetwork,
      wallet,
      verbose,
    };

    // masa client
    this.client = new MasaClient({
      apiUrl,
      cookie,
    });

    // arweave client
    this.arweave = new MasaArweave(arweave, this.config);

    // masa contracts wrapper
    this.contracts = new MasaContracts(this.config);
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
  }

  utils = {
    version,
  };
}
