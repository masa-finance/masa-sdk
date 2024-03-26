import {
  DataPointsMulti,
  DataPointsMulti__factory,
  DataStakingDynamicNative,
  DataStakingDynamicNative__factory,
} from "@masa-finance/masa-contracts-marketplace";
import { Signer } from "ethers";

import { ContractInfo, IMarketplaceContracts, NetworkName } from "../interface";
import { addresses } from "../networks";
import { loadContract } from "./load-contract";

export const loadMarketplaceContracts = ({
  signer,
  networkName = "ethereum",
}: {
  signer: Signer;
  networkName?: NetworkName;
}): IMarketplaceContracts => {
  let DataStakingDynamicNative: Array<DataStakingDynamicNative & ContractInfo> =
    [];

  // Only load DataStakingDynamicNative contracts if the networkName is 'masatest'
  if (networkName === "masatest") {
    const DataStakingDynamicNativeAddresses =
      addresses[networkName]?.DataStakingDynamicNativeAddress;
    if (!Array.isArray(DataStakingDynamicNativeAddresses)) {
      throw new Error(
        "Expected an array of DataStakingDynamicNative addresses",
      );
    }
    DataStakingDynamicNative = DataStakingDynamicNativeAddresses.map(
      (address: string) =>
        loadContract<DataStakingDynamicNative & ContractInfo>({
          factory: new DataStakingDynamicNative__factory(),
          address,
          signer,
        }),
    );
  }
  // Note: For other networks, DataStakingDynamicNative remains an empty array

  // DataPointsMulti - unchanged
  const DataPointsMulti = loadContract<DataPointsMulti & ContractInfo>({
    factory: new DataPointsMulti__factory(),
    address: addresses[networkName]?.DataPointsMultiAddress,
    signer,
  });

  return {
    DataStakingDynamicNative,
    DataPointsMulti,
  };
};
