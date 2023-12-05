import { providers } from "ethers";

export class StaticJsonRpcProvider extends providers.JsonRpcProvider {
  public async getNetwork(): Promise<providers.Network> {
    await this.ready;
    // cache network id once we have it, this will never change before this service restarts
    // details: https://github.com/ethers-io/ethers.js/issues/901
    if (this._network) {
      return this._network;
    }
    return super.getNetwork();
  }
}
