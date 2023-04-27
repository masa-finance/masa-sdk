import { Signer, utils, Wallet } from "ethers";
import {
  MasaSBTAuthority,
  MasaSBTSelfSovereign,
  MasaSBTSelfSovereign__factory,
} from "@masa-finance/masa-contracts-identity";
import { MasaConfig } from "../interface";

export class ContractFactory {
  static connect: <Contract>(
    address: string,
    signerOrProvider: Signer | Wallet
  ) => Contract;
}

/**
 *
 * @param masaConfig
 * @param address
 * @param factory
 */
export const loadSBTContract = async <
  Contract extends MasaSBTSelfSovereign | MasaSBTAuthority
>(
  masaConfig: MasaConfig,
  address: string,
  factory: ContractFactory = MasaSBTSelfSovereign__factory
): Promise<Contract | undefined> => {
  let selfSovereignSBT: Contract | undefined;

  // fetch code to see if the contract exists
  const code: string | undefined = await masaConfig.wallet.provider?.getCode(
    address
  );
  const contractExists: boolean = code !== "0x";

  if (utils.isAddress(address)) {
    selfSovereignSBT = contractExists
      ? (factory as typeof ContractFactory).connect<Contract>(
          address,
          masaConfig.wallet
        )
      : undefined;

    if (selfSovereignSBT) {
      if (masaConfig.verbose) {
        console.info(await selfSovereignSBT.name());
      }
    } else {
      console.error(
        `Smart contract '${address}' does not exist on network '${masaConfig.networkName}'!`
      );
    }
  } else {
    console.error(`Address '${address}' is not valid!`);
  }

  return selfSovereignSBT;
};
