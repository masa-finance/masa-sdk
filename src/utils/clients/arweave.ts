import Arweave from "arweave";
import { config } from "./config";

export const arweave = Arweave.init({
  host: config.get("arweave-host") as string,
  port: config.get("arweave-port") as number,
  protocol: config.get("arweave-protocol") as string,
  logging: config.get("arweave-logging") as boolean,
});
