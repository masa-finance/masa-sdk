import Masa from "../../masa";
import {
  MasaSBTAuthority,
  ReferenceSBTAuthority,
} from "@masa-finance/masa-contracts-identity";
import { Contract } from "ethers";

import { abi } from "@masa-finance/masa-contracts-identity/artifacts/contracts/reference/ReferenceSBTAuthority.sol/ReferenceSBTAuthority.json";
import { Messages } from "../../utils";
import { LogDescription } from "@ethersproject/abi";
import { PaymentMethod } from "../../interface";

/**
 *
 * @param masa
 * @param sbtContract
 * @param receiver
 * @param paymentMethod
 */
export const mintASBT = async (
  masa: Masa,
  sbtContract: MasaSBTAuthority,
  receiver: string,
  paymentMethod: PaymentMethod = "ETH"
) => {
  const [name, symbol] = await Promise.all([
    sbtContract.name(),
    sbtContract.symbol(),
  ]);

  console.log(`Minting ASBT on: '${masa.config.networkName}'`);
  console.log(`Contract Name: '${name}'`);
  console.log(`Contract Symbol: '${symbol}'`);
  console.log(`Contract Address: '${sbtContract.address}'`);
  console.log(`To receiver: '${receiver}'`);

  const asbt: ReferenceSBTAuthority = (await new Contract(
    sbtContract.address,
    abi,
    masa.config.wallet
  ).deployed()) as ReferenceSBTAuthority;

  const args: [
    string, // paymentAddress string
    string // receiver string
  ] = [masa.contracts.sbt.getPaymentAddress(paymentMethod), receiver];

  if (masa.config.verbose) {
    console.info(args);
  }

  const { wait, hash } = await asbt["mint(address,address)"](...args);
  console.log(Messages.WaitingToFinalize(hash));

  const { logs } = await wait();

  const parsedLogs = masa.contracts.parseLogs(logs, [asbt]);

  const mintEvent = parsedLogs.find(
    (log: LogDescription) => log.name === "Mint"
  );

  if (mintEvent) {
    const { args } = mintEvent;
    console.log(
      `Minted to token with ID: ${args._tokenId} receiver '${args._owner}'`
    );
  }
};
