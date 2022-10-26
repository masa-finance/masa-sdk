import { session } from "./session";
import { contracts } from "./contracts";
import { account, createRandomWallet } from "./account";
import { creditScore } from "./creditScore";
import { identity } from "./identity";
import { soulNames } from "./soulNames";

import { MasaClient, arweave as arweaveInit } from "./utils";
import { version } from "./helpers";
import { MasaArgs, MasaConfig } from "./interface";

export default class Masa {
  public readonly client: MasaClient;
  public readonly arweaveClient;

  constructor({
    cookie,
    wallet = createRandomWallet(),
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

    this.arweaveClient = arweaveInit(arweave);

    this.config = {
      apiUrl,
      environment,
      network,
      wallet,
    };
  }

  public config: MasaConfig;

  session = session(this);
  identity = identity(this);
  account = account(this);
  soulNames = soulNames(this);

  metadata = {
    store: (soulName: string) => this.client.storeMetadata(soulName),
    retrieve: (url: string) => this.client.getMetadata(url),
  };

  creditScore = creditScore(this);

  utils = {
    version,
  };

  contracts = contracts(this);
}
