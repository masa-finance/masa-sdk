import Masa from "../../masa";
import { ReferenceSBTAuthority } from "@masa-finance/masa-contracts-identity";
import { Messages } from "../../utils";
import { LogDescription } from "@ethersproject/abi";
import { PaymentMethod } from "../../interface";
import { BigNumber, PayableOverrides } from "ethers";

/**
 *
 * @param masa
 * @param sbtContract
 * @param receiver
 * @param paymentMethod
 */
export const mintASBT = async (
  masa: Masa,
  sbtContract: ReferenceSBTAuthority,
  receiver: string,
  paymentMethod: PaymentMethod = "ETH"
): Promise<boolean> => {
  const [name, symbol] = await Promise.all([
    sbtContract.name(),
    sbtContract.symbol(),
  ]);

  console.log(`Minting ASBT on: '${masa.config.networkName}'`);
  console.log(`Contract Name: '${name}'`);
  console.log(`Contract Symbol: '${symbol}'`);
  console.log(`Contract Address: '${sbtContract.address}'`);
  console.log(`To receiver: '${receiver}'`);

  const { getPrice } = await masa.contracts.sbt.attach(sbtContract);

  // current limit for ASBT is 1 on the default installation
  const limit: number = 1;

  // todo get the limit from the contract if done
  const balance: BigNumber = await sbtContract.balanceOf(receiver);

  if (balance.gte(limit)) {
    console.error(
      `Minting of ASBT failed: '${receiver}' exceeded the limit of '${limit}'!`
    );
    return false;
  }

  const { price, paymentAddress } = await getPrice(paymentMethod);

  const mintASBTArguments: [
    string, // paymentAddress string
    string // receiver string
  ] = [paymentAddress, receiver];

  const mintASBTOverrides: PayableOverrides = {
    value: price.gt(0) ? price : undefined,
  };

  if (masa.config.verbose) {
    console.info(mintASBTArguments, mintASBTOverrides);
  }

  const {
    "mint(address,address)": mint,
    estimateGas: { "mint(address,address)": estimateGas },
  } = sbtContract;

  const gasLimit = await estimateGas(...mintASBTArguments, mintASBTOverrides);

  const { wait, hash } = await mint(...mintASBTArguments, {
    ...mintASBTOverrides,
    gasLimit,
  });

  console.log(Messages.WaitingToFinalize(hash));

  const { logs } = await wait();

  const parsedLogs = masa.contracts.parseLogs(logs, [sbtContract]);

  const mintEvent = parsedLogs.find(
    (log: LogDescription) => log.name === "Mint"
  );

  if (mintEvent) {
    const { args } = mintEvent;
    console.log(
      `Minted to token with ID: ${args._tokenId} receiver '${args._owner}'`
    );

    return true;
  }

  return false;
};
