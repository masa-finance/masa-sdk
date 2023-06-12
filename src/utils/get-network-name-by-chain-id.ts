import { SupportedNetworks } from "../collections";
import type { Network, NetworkName } from "../interface";

export const getNetworkNameByChainId = (chainId: number): NetworkName => {
  const network: Network | undefined = Object.values(SupportedNetworks).find(
    (network: Network) => network.chainId === chainId
  );

  if (!network) {
    console.warn("Network detection failed!", chainId);
    return "unknown";
  }

  return network.networkName;
};
