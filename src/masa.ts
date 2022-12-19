import {
  arweave as arweaveInit,
  createRandomWallet,
  Masa2FA,
  MasaAccount,
  MasaArgs,
  MasaClient,
  MasaConfig,
  MasaContracts,
  MasaCreditScore,
  MasaIdentity,
  MasaSession,
  MasaSoulNames,
  version,
} from "./";
import Arweave from "arweave";

export default class Masa {
  public readonly arweave: Arweave;

  public readonly client: MasaClient;
  public readonly config: MasaConfig;
  public readonly contracts: MasaContracts;
  public readonly session: MasaSession;
  public readonly identity: MasaIdentity;
  public readonly soulNames: MasaSoulNames;
  public readonly creditScore: MasaCreditScore;
  public readonly account: MasaAccount;
  public readonly twoFA: Masa2FA;

  public constructor(
    {
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
    }: MasaArgs = {
      wallet: createRandomWallet(),
    }
  ) {
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
    this.session = new MasaSession(this);
    this.identity = new MasaIdentity(this);
    this.soulNames = new MasaSoulNames(this);
    this.creditScore = new MasaCreditScore(this);
    this.account = new MasaAccount(this);
    this.twoFA = new Masa2FA(this);
  }

  metadata = {
    store: (soulName: string) => this.client.storeMetadata(soulName),
    retrieve: (url: string) => this.client.getMetadata(url),
  };
  utils = {
    version,
  };
}
