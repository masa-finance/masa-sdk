import { session } from "./session";
import { contracts } from "./contracts";
import { account, createRandomWallet } from "./account";
import { creditScore } from "./credit-score";
import { identity } from "./identity";
import { soulNames } from "./soul-name";
import { twoFA } from "./2fa";

import { MasaClient, arweave as arweaveInit } from "./utils";
import { version } from "./helpers";
import { MasaArgs, MasaConfig } from "./interface";

export default class Masa {
  public readonly client: MasaClient;
  public readonly arweaveClient;

  constructor(
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
  soulNames = soulNames(this);
  creditScore = creditScore(this);
  account = account(this);
  contracts = contracts(this);
  twoFA = twoFA(this);
  metadata = {
    store: (soulName: string) => this.client.storeMetadata(soulName),
    retrieve: (url: string) => this.client.getMetadata(url),
  };
  utils = {
    version,
  };
}
