import Arweave from "arweave";
import { ApiConfig } from "arweave/node/lib/api";
import { Config } from "arweave/node/common";
import axios from "axios";
import { MasaConfig } from "../../interface";

export class MasaArweave extends Arweave {
  constructor(config: ApiConfig, private masaConfig: MasaConfig) {
    super({ ...config, logging: masaConfig.verbose });
  }

  async loadTransactionData(
    txId: string,
    isString: boolean = true
  ): Promise<object | Uint8Array | undefined> {
    let data;

    try {
      const { status } = await this.transactions.getStatus(txId);

      if (status && status === 200) {
        const dataResponse = await this.transactions.getData(
          txId,
          isString
            ? {
                decode: true,
                string: true,
              }
            : {
                decode: true,
              }
        );

        data = isString
          ? JSON.parse(dataResponse as string)
          : (dataResponse as Uint8Array);
      }
    } catch (error) {
      if (error instanceof Error && this.masaConfig.verbose) {
        console.error("Arweave getData failed!", error.message);
      }
    }

    if (!data) {
      const config: Config = this.getConfig();
      const url = `${config.api.protocol}://${config.api.host}:${config.api.port}/${txId}`;

      if (this.masaConfig.verbose) {
        console.error(
          `Failed to load arweave tx id: ${txId} getting ${url} instead`
        );
      }

      const { data: dataResponse } = await axios.get(
        url,
        isString
          ? {}
          : {
              responseType: "arraybuffer",
            }
      );

      if (dataResponse) {
        data = dataResponse;
      }
    }

    return data;
  }
}
