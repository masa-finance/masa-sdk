import { BigNumber, ethers } from "ethers";
import { logout } from "./session/logout";
import { checkLogin } from "./session/check-login";
import { version } from "./helpers/version";
import { login } from "./session/login";
import { addresses, loadIdentityContracts } from "./contracts";
import MasaClient from "./utils/clients/middleware";
import { arweave } from "./utils/clients/arweave";
import { loadSoulNamesFromIdentity } from "./soul-name/loadSoulNamesFromIdentity";
import { getBalances } from "./account/getBalances";
import { createRandomWallet } from "./account/createRandomWallet";
import { loadIdentity } from "./identity/loadIdentity";
import { patchMetadataUrl } from "./helpers/patchMetadataUrl";

export default class Masa {
  public readonly client: MasaClient;
  public readonly arweaveClient;

  constructor({
    cookie,
    wallet,
    apiUrl,
    environment,
    arweave: { host, port, protocol, logging },
  }: {
    cookie?: string;
    wallet: ethers.Signer;
    apiUrl: string;
    environment: string;
    arweave: {
      host: string;
      port: number;
      protocol: string;
      logging: boolean;
    };
  }) {
    this.client = new MasaClient({
      apiUrl,
      cookie,
    });

    this.arweaveClient = arweave({
      host,
      port,
      protocol,
      logging,
    });

    this.config.wallet = wallet;
    this.config.apiUrl = apiUrl;
    this.config.environment = environment;
  }

  public config: {
    apiUrl: string;
    environment: string;
    network: string;
    wallet: ethers.Signer;
  } = {
    apiUrl: "https://dev.middleware.masa.finance",
    environment: "dev",
    network: "goerli",
    wallet: createRandomWallet(),
  };

  session = {
    checkLogin: () => checkLogin(this),
    sessionLogout: () => this.client.sessionLogout(),
    login: () => login(this),
    logout: () => logout(this),
  };

  identity = {
    loadIdentity: (address: string) => loadIdentity(this, address),
  };

  account = {
    getBalances: (address: string) => getBalances(this, address),
  };

  soulNames = {
    loadSoulNamesFromIdentity: (identityId: BigNumber) =>
      loadSoulNamesFromIdentity(this, identityId),
  };

  metadata = {
    metadataStore: (soulName: string) => this.client.metadataStore(soulName),
    getMetadata: (url: string) => this.client.getMetadata(url),
    patchMetadataUrl: (tokenUri: string) => patchMetadataUrl(this, tokenUri),
  };

  creditScore = {
    creditScoreMint: (address: string, signature: string) =>
      this.client.creditScoreMint(address, signature),
  };

  utils = {
    version,
  };

  contracts = {
    loadIdentityContracts: () =>
      loadIdentityContracts({
        provider: this.config.wallet.provider,
        network: this.config.network,
      }),
    addresses,
  };
}
