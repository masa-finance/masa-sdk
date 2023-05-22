import Masa from "../../masa";
import { ReferenceSBTAuthority } from "@masa-finance/masa-contracts-identity";
import { Messages } from "../../utils";
import { LogDescription } from "@ethersproject/abi";
import { PaymentMethod } from "../../interface";
import { PayableOverrides } from "ethers";

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

  const { getPrice } = await masa.contracts.sbt.attach(sbtContract);

  const { price, paymentAddress } = await getPrice(paymentMethod);

  const mintASBTArguments: [
    string, // paymentAddress string
    string // receiver string
  ] = [paymentAddress, receiver];

  const mintASBTOverrides: PayableOverrides = {
    value: price,
  };

  if (masa.config.verbose) {
    console.info(mintASBTArguments, mintASBTOverrides);
  }

  const { wait, hash } = await sbtContract["mint(address,address)"](
    ...mintASBTArguments,
    mintASBTOverrides
  );
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
  }
};
