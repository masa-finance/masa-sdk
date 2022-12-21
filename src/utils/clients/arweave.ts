import Arweave from "arweave";
import { ApiConfig } from "arweave/node/lib/api";
import { Config } from "arweave/node/common";
import axios from "axios";

export const arweave = ({
  host,
  port,
  protocol,
  logging = false,
}: {
  host: string;
  port: number;
  protocol: string;
  logging?: boolean;
}) => {
  return new MasaArweave({
    host,
    port,
    protocol,
    logging,
  });
};

export class MasaArweave extends Arweave {
  constructor(config: ApiConfig) {
    super(config);
  }

  async loadTransactionData(
    txId: string,
    string = true
  ): Promise<object | Uint8Array | undefined> {
    let data;

    try {
      const { status } = await this.transactions.getStatus(txId);

      if (status && status === 200) {
        const dataResponse = await this.transactions.getData(
          txId,
          string
            ? {
                decode: true,
                string: true,
              }
            : {
                decode: true,
              }
        );

        data = string
          ? JSON.parse(dataResponse as string)
          : (dataResponse as Uint8Array);
      }
    } catch {
      console.error("Arweave getData failed!");
    }

    if (!data) {
      const config: Config = this.getConfig();
      const url = `${config.api.protocol}://${config.api.host}:${config.api.port}/${txId}`;
      console.error(
        `Failed to load arweave tx id: ${txId} getting ${url} instead`
      );

      const { data: dataResponse } = await axios.get(
        url,
        string
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
