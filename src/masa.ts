import {
  arweave as arweaveInit,
  Masa2FA,
  MasaAccount,
  MasaArgs,
  MasaArweave,
  MasaClient,
  MasaConfig,
  MasaContracts,
  MasaCreditScore,
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
  public readonly twoFA: Masa2FA;

  public constructor({
    cookie,
    wallet,
    apiUrl = "https://dev.middleware.masa.finance",
    environment = "dev",
    network = "goerli",
    arweave = {
      host: "arweave.net",
      port: 443,
      protocol: "https",
      logging: false,
    },
  }: MasaArgs) {
    this.client = new MasaClient({
      apiUrl,
      cookie,
    });

    this.arweave = arweaveInit(arweave);

    this.config = {
      apiUrl,
      environment,
      network,
      wallet,
    };

    this.contracts = new MasaContracts(this.config);
    this.account = new MasaAccount(this);
    this.session = new MasaSession(this);
    this.identity = new MasaIdentity(this);
    this.soulName = new MasaSoulName(this);
    this.creditScore = new MasaCreditScore(this);
    this.twoFA = new Masa2FA(this);
  }

  metadata = {
    store: (soulName: string, receiver: string, duration: number) =>
      this.client.storeMetadata(soulName, receiver, duration),
    retrieve: (url: string, additionalHeaders?: Record<string, string>) =>
      this.client.getMetadata(url, additionalHeaders),
  };

  utils = {
    version,
  };
}
