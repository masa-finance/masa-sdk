import {
  DataPointsMulti,
  DataPointsMulti__factory,
  ProxyViewAggregator,
  ProxyViewAggregator__factory,
} from "@masa-finance/masa-contracts-marketplace";
import { Connection, Keypair } from "@solana/web3.js";
import { Signer } from "ethers";

import { ContractInfo, IMarketplaceContracts, NetworkName } from "../interface";
import { addresses } from "../networks";
import { loadContract } from "./load-contract";

export const loadMarketplaceContracts = ({
  signer,
  networkName = "ethereum",
}: {
  signer:
    | Signer
    | {
        keypair: Keypair;
        connection: Connection;
      };
  networkName?: NetworkName;
}): IMarketplaceContracts => {
  // DataPointsMulti
  const DataPointsMulti = loadContract<DataPointsMulti & ContractInfo>({
    factory: new DataPointsMulti__factory(),
    address: addresses[networkName]?.DataPointsMultiAddress,
    signer,
  });

  // ProxyViewAggregator
  const ProxyViewAggregator = loadContract<ProxyViewAggregator & ContractInfo>({
    factory: new ProxyViewAggregator__factory(),
    address: addresses[networkName]?.ProxyViewAggregatorAddress,
    signer,
  });

  return {
    DataPointsMulti,
    ProxyViewAggregator,
  };
};
