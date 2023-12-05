import { SupportedNetworks } from "../collections";
import type { Network, NetworkName } from "../interface";
import { logger } from "./logger";

export const getNetworkNameByChainId = (chainId: number): NetworkName => {
  const network: Network | undefined = Object.values(SupportedNetworks).find(
    (network: Network) => network.chainId === chainId,
  );

  if (!network) {
    logger("warn", `Network detection failed! ${chainId}`);
    return "unknown";
  }

  return network.networkName;
};
