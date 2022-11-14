import { session } from "./session";
import { MasaContracts } from "./contracts";
import { account, createRandomWallet } from "./account";
import { creditScore } from "./credit-score";
import { identity } from "./identity";
import { soulNames } from "./soul-name";
import { twoFA } from "./2fa";

import { arweave as arweaveInit, MasaClient } from "./utils";
import { version } from "./helpers";
import { MasaArgs, MasaConfig } from "./interface";
import Arweave from "arweave";

export default class Masa {
  public readonly client: MasaClient;
  public readonly arweave: Arweave;
  public readonly config: MasaConfig;
  public readonly contracts: MasaContracts;

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
  }

  session = session(this);
  identity = identity(this);
  soulNames = soulNames(this);
  creditScore = creditScore(this);
  account = account(this);
  twoFA = twoFA(this);
  metadata = {
    store: (soulName: string) => this.client.storeMetadata(soulName),
    retrieve: (url: string) => this.client.getMetadata(url),
  };
  utils = {
    version,
  };
}
