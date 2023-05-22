import Masa from "../../masa";
import { ReferenceSBTSelfSovereign } from "@masa-finance/masa-contracts-identity";
import { Messages } from "../../utils";
import { LogDescription } from "@ethersproject/abi";
import { PaymentMethod } from "../../interface";
import { PayableOverrides } from "ethers";

export const mintSSSBT = async (
  masa: Masa,
  sbtContract: ReferenceSBTSelfSovereign,
  authorityAddress: string,
  signatureDate: number,
  signature: string,
  paymentMethod: PaymentMethod = "ETH"
) => {
  const receiver = await masa.config.wallet.getAddress();

  const [name, symbol] = await Promise.all([
    sbtContract.name(),
    sbtContract.symbol(),
  ]);

  console.log(`Minting SSSBT on: '${masa.config.networkName}'`);
  console.log(`Contract Name: '${name}'`);
  console.log(`Contract Symbol: '${symbol}'`);
  console.log(`Contract Address: '${sbtContract.address}'`);
  console.log(`To receiver: '${receiver}'`);

  const { prepareMint, getPrice } = await masa.contracts.sbt.attach(
    sbtContract
  );

  const types = {
    Mint: [
      { name: "to", type: "address" },
      { name: "authorityAddress", type: "address" },
      { name: "signatureDate", type: "uint256" },
    ],
  };

  // fill the collection with data
  const value: {
    to: string;
    authorityAddress: string;
    signatureDate: number;
  } = {
    to: receiver,
    authorityAddress,
    signatureDate,
  };

  const prepareMintResults = await prepareMint(
    paymentMethod,
    "ReferenceSBTSelfSovereign",
    types,
    value,
    signature,
    authorityAddress
  );

  const { price, paymentAddress } = await getPrice(paymentMethod);

  const mintSSSBTArguments: [
    string, // paymentMethod string
    string, // to string
    string, // authorityAddress string
    number, // authorityAddress number
    string // signature string
  ] = [paymentAddress, receiver, authorityAddress, signatureDate, signature];

  const mintSSSBTOverrides: PayableOverrides = {
    value: price.gt(0) ? price : undefined,
  };

  if (masa.config.verbose) {
    console.info(mintSSSBTArguments, prepareMintResults);
  }

  const {
    "mint(address,address,address,uint256,bytes)": mint,
    estimateGas: { "mint(address,address,address,uint256,bytes)": estimateGas },
  } = sbtContract;

  const gasLimit = await estimateGas(...mintSSSBTArguments, mintSSSBTOverrides);

  const { wait, hash } = await mint(...mintSSSBTArguments, {
    ...mintSSSBTOverrides,
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

  return;
};
