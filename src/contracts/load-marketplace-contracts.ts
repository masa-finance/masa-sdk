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
  // Data Staking
  const DataStakingDynamicNative = loadContract<
    DataStakingDynamicNative & ContractInfo
  >({
    factory: new DataStakingDynamicNative__factory(),
    address: addresses[networkName]?.DataStakingDynamicNativeAddress,
    signer,
  });

  // DataPointsMulti
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
