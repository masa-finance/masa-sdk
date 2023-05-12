import Masa from "../../masa";
import {
  MasaSBTSelfSovereign,
  ReferenceSBTSelfSovereign,
} from "@masa-finance/masa-contracts-identity";
import { Contract } from "ethers";
import { abi } from "@masa-finance/masa-contracts-identity/artifacts/contracts/reference/ReferenceSBTSelfSovereign.sol/ReferenceSBTSelfSovereign.json";
import { Messages } from "../../utils";
import { LogDescription } from "@ethersproject/abi";
import { PaymentMethod } from "../../interface";

export const mintSSSBT = async (
  masa: Masa,
  sbtContract: MasaSBTSelfSovereign,
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

  const sssbt: ReferenceSBTSelfSovereign = (await new Contract(
    sbtContract.address,
    abi,
    masa.config.wallet
  ).deployed()) as ReferenceSBTSelfSovereign;

  const args: [
    string, // paymentMethod string
    string, // to string
    string, // authorityAddress string
    number, // authorityAddress number
    string // signature string
  ] = [
    masa.contracts.sbt.getPaymentAddress(paymentMethod),
    receiver,
    authorityAddress,
    signatureDate,
    signature,
  ];

  const { prepareMint } = await masa.contracts.sbt.attach(sssbt);

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
    name,
    types,
    value,
    signature,
    authorityAddress
  );

  if (masa.config.verbose) {
    console.info(args, prepareMintResults);
  }

  const { wait, hash } = await sssbt[
    "mint(address,address,address,uint256,bytes)"
  ](...args);

  console.log(Messages.WaitingToFinalize(hash));

  const { logs } = await wait();

  const parsedLogs = masa.contracts.parseLogs(logs, [sssbt]);

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
