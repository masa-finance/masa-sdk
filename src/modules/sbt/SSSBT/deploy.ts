import type { ReferenceSBTSelfSovereign } from "@masa-finance/masa-contracts-identity";
import {
  abi,
  bytecode,
} from "@masa-finance/masa-contracts-identity/artifacts/contracts/reference/ReferenceSBTSelfSovereign.sol/ReferenceSBTSelfSovereign.json";
import { PaymentGateway } from "@masa-finance/masa-contracts-identity/dist/typechain/contracts/reference/ReferenceSBTSelfSovereign";
import { constants, ContractFactory } from "ethers";

import { Messages } from "../../../collections";
import type { MasaInterface } from "../../../interface";
import PaymentParamsStruct = PaymentGateway.PaymentParamsStruct;

export const deploySSSBT = async (
  masa: MasaInterface,
  name: string,
  symbol: string,
  baseTokenUri: string,
  limit: number = 1,
  authorityAddress?: string,
  adminAddress?: string
): Promise<string | undefined> => {
  let result;

  adminAddress = adminAddress || (await masa.config.signer.getAddress());
  authorityAddress =
    authorityAddress || (await masa.config.signer.getAddress());

  console.log(`Deploying SSSBT to network '${masa.config.networkName}'`);

  const factory: ContractFactory = new ContractFactory(
    abi,
    bytecode,
    masa.config.signer
  );

  const args: [
    string, // address admin
    string, // string name
    string, // string symbol
    string, // string baseTokenURI
    string, // address soulboundIdentity
    PaymentParamsStruct, // PaymentParams paymentParams
    number
  ] = [
    adminAddress,
    name,
    symbol,
    baseTokenUri,
    masa.contracts.instances.SoulboundIdentityContract.address,
    {
      swapRouter: constants.AddressZero,
      wrappedNativeToken: constants.AddressZero,
      stableCoin: constants.AddressZero,
      masaToken: constants.AddressZero,
      projectFeeReceiver: constants.AddressZero,
      protocolFeeReceiver: constants.AddressZero,
      protocolFeeAmount: 0,
      protocolFeePercent: 0,
    },
    limit,
  ];

  if (masa.config.verbose) {
    console.info(...args);
  }

  try {
    const {
      addAuthority,
      deployTransaction: { wait, hash },
      address,
    } = (await factory.deploy(...args)) as ReferenceSBTSelfSovereign;

    console.log(Messages.WaitingToFinalize(hash));

    await wait();

    {
      console.log(`Adding authority: ${authorityAddress}`);
      const { hash, wait } = await addAuthority(authorityAddress);
      console.log(Messages.WaitingToFinalize(hash));

      await wait();
    }

    console.log(
      `SSSBT successfully deployed to '${masa.config.networkName}' with contract address: '${address}'`
    );

    result = address;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("SSSBT deployment failed!", error.message);
    }
  }

  return result;
};