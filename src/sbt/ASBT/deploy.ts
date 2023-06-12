import {
  abi,
  bytecode,
} from "@masa-finance/masa-contracts-identity/artifacts/contracts/reference/ReferenceSBTAuthority.sol/ReferenceSBTAuthority.json";
import { PaymentGateway } from "@masa-finance/masa-contracts-identity/dist/typechain/contracts/reference/ReferenceSBTAuthority";
import { constants, ContractFactory } from "ethers";

import { Messages } from "../../utils";
import PaymentParamsStruct = PaymentGateway.PaymentParamsStruct;
import { MasaInterface } from "../../interface/masa-interface";

export const deployASBT = async (
  masa: MasaInterface,
  name: string,
  symbol: string,
  baseTokenUri: string,
  limit: number = 1,
  adminAddress?: string
): Promise<string | undefined> => {
  adminAddress = adminAddress || (await masa.config.signer.getAddress());

  console.log(`Deploying ASBT to network '${masa.config.networkName}'`);

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
    PaymentParamsStruct, // PaymentParams paymentParams,
    number // number _maxSBTToMint
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
      deployTransaction: { wait, hash },
      address,
    } = await factory.deploy(...args);
    console.log(Messages.WaitingToFinalize(hash));

    await wait();

    console.log(
      `ASBT successfully deployed to '${masa.config.networkName}' with contract address: '${address}'`
    );

    return address;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("ASBT deployment failed!", error.message);
    }
  }
};
