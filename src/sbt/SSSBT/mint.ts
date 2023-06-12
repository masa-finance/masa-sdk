import { ReferenceSBTSelfSovereign } from "@masa-finance/masa-contracts-identity";

import { MasaInterface } from "../../interface/masa-interface";
import { PaymentMethod } from "../../interface/payment-method";

export const mintSSSBT = async (
  masa: MasaInterface,
  contract: ReferenceSBTSelfSovereign,
  authorityAddress: string,
  signatureDate: number,
  signature: string,
  paymentMethod: PaymentMethod = "ETH"
): Promise<boolean> => {
  const receiver = await masa.config.signer.getAddress();

  const [name, symbol] = await Promise.all([
    contract.name(),
    contract.symbol(),
  ]);

  console.log(`Minting SSSBT on: '${masa.config.networkName}'`);
  console.log(`Contract Name: '${name}'`);
  console.log(`Contract Symbol: '${symbol}'`);
  console.log(`Contract Address: '${contract.address}'`);
  console.log(`To receiver: '${receiver}'`);

  const { mint } = await masa.contracts.sssbt.attach(contract);

  return mint(
    paymentMethod,
    receiver,
    signature,
    signatureDate,
    authorityAddress
  );
};
