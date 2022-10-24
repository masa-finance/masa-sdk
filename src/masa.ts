import { BigNumber, ethers } from "ethers";
import { logout } from "./session/logout";
import { checkLogin } from "./session/check-login";
import { loadIdentity } from "./identity/load-identity";
import { version } from "./helpers/version";
import { login } from "./session/login";
import { addresses, loadIdentityContracts } from "./contracts";
import MasaClient from "./utils/clients/middleware";
import { arweave } from "./utils/clients/arweave";
import { loadSoulNamesFromIdentity } from "./soul-name/loadSoulNamesFromIdentity";
import { patchMetadataUrl } from "./helpers/patch-metadata-url";
import { getBalances } from "./account/getBalances";

export default class Masa {
  public readonly client: MasaClient;
  public readonly arweaveClient;

  constructor({
    provider,
    apiUrl,
    environment,
    arweave: { host, port, protocol, logging },
  }: {
    provider: ethers.providers.JsonRpcProvider;
    apiUrl: string;
    environment: string;
    arweave: {
      host: string;
      port: number;
      protocol: string;
      logging: boolean;
    };
  }) {
    this.client = new MasaClient({ apiUrl });
    this.arweaveClient = arweave(host, port, protocol, logging);

    this.config.apiUrl = apiUrl;
    this.config.provider = provider;
    this.config.environment = environment;
  }

  public config: {
    cookie?: string;
    apiUrl: string;
    environment: string;
    network: string;
    provider: ethers.providers.JsonRpcProvider;
  } = {
    apiUrl: "https://dev.middleware.masa.finance",
    environment: "dev",
    network: "goerli",
    provider: new ethers.providers.JsonRpcProvider(
      "https://rpc.ankr.com/eth_goerli"
    ),
  };

  session = {
    checkLogin: () => checkLogin(this),
    sessionLogout: (cookie?: string) => this.client.sessionLogout(cookie),
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
    metadataStore: (soulName: string) =>
      this.client.metadataStore(soulName, this.config.cookie),
    getMetadata: (url: string) =>
      this.client.getMetadata(url, this.config.cookie),
    patchMetadataUrl: (tokenUri: string) => patchMetadataUrl(this, tokenUri),
  };

  creditScore = {
    creditScoreMint: (address: string, signature: string) =>
      this.client.creditScoreMint(address, signature, this.config.cookie),
  };

  utils = {
    version,
  };

  contracts = {
    loadIdentityContracts: () =>
      loadIdentityContracts({
        provider: this.config.provider,
        network: this.config.network,
      }),
    addresses,
  };
}
