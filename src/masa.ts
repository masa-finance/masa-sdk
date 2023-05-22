import {
  MasaAccount,
  MasaArgs,
  MasaArweave,
  MasaASBT,
  MasaClient,
  MasaConfig,
  MasaContracts,
  MasaCreditScore,
  MasaGreen,
  MasaIdentity,
  MasaSBT,
  MasaSession,
  MasaSoulName,
  MasaSSSBT,
  SupportedNetworks,
  version,
} from "./";
import {
  MasaSBT as MasaSBTContract,
  ReferenceSBTAuthority,
  ReferenceSBTSelfSovereign,
} from "@masa-finance/masa-contracts-identity";

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
  public readonly sbt: MasaSBT<MasaSBTContract>;
  public readonly asbt: MasaASBT<ReferenceSBTAuthority>;
  public readonly sssbt: MasaSSSBT<ReferenceSBTSelfSovereign>;

  public constructor({
    cookie,
    wallet,
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
      wallet,
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
    this.sbt = new MasaSBT(this);
    // ASBT handler
    this.asbt = new MasaASBT(this);
    // SSSBT Handler
    this.sssbt = new MasaSSSBT(this);
  }

  utils = {
    version,
  };
}
