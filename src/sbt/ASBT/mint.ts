import { ReferenceSBTAuthority } from "@masa-finance/masa-contracts-identity";

import { MasaInterface } from "../../interface/masa-interface";
import { PaymentMethod } from "../../interface/payment-method";

/**
 *
 * @param masa
 * @param sbtContract
 * @param receiver
 * @param paymentMethod
 */
export const mintASBT = async (
  masa: MasaInterface,
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

  const { mint } = await masa.contracts.asbt.attach(sbtContract);

  return mint(paymentMethod, receiver);
};
