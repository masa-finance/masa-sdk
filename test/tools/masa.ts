import { constants, providers, VoidSigner } from "ethers";

import { Masa, NetworkName, SupportedNetworks } from "../../src";

export const getTestMasa = (networkName: NetworkName): Masa => {
  const provider = new providers.JsonRpcProvider(
    SupportedNetworks[networkName].rpcUrls[0],
  );

  return new Masa({
    signer: new VoidSigner(constants.AddressZero, provider),
    networkName,
  });
};
