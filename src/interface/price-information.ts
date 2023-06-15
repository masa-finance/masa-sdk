import type { BigNumber } from "@ethersproject/bignumber";

export interface PriceInformation {
  paymentAddress: string;
  price: BigNumber;
  formattedPrice: string;
  mintFee: BigNumber;
  formattedMintFee: string;
  protocolFee: BigNumber;
  formattedProtocolFee: string;
}
