import { ethers } from "ethers";
import { logout } from "./session/logout";
import { checkLogin } from "./session/check-login";
import { loadIdentity } from "./identity/load-identity";
import { version } from "./helpers/version";
import { login } from "./session/login";
import { addresses, loadIdentityContracts } from "./contracts";
import MasaClient from "./utils/clients/middleware";

export default class Masa {
  public readonly client: MasaClient;

  constructor({
    provider,
    apiUrl,
  }: {
    provider: ethers.providers.JsonRpcProvider;
    apiUrl: string;
  }) {
    this.client = new MasaClient({ apiUrl });

    this.config.apiUrl = apiUrl;
    this.config.provider = provider;
  }

  public config: {
    cookie?: string;
    apiUrl: string;
    environment: string;
    network: string;
    provider?: ethers.providers.JsonRpcProvider;
  } = {
    apiUrl: "https://dev.middleware.masa.finance",
    environment: "dev",
    network: "goerli",
  };

  session = {
    checkLogin: () => checkLogin(this),
    sessionLogout: (cookie?: string) => this.client.sessionLogout(cookie),
    login,
    logout,
  };

  identity = {
    loadIdentity,
  };

  creditScore = {
    creditScoreMint: (address: string, signature: string) =>
      this.client.creditScoreMint(address, signature, this.config.cookie),
  };

  utils = {
    version,
  };

  contracts = {
    loadIdentityContracts,
    addresses,
  };
}
