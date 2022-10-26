import * as goerli from "./networks/goerli";

export interface Addresses {
  [index: string]: {
    MASA: string;
    USDC: string;
    WETH: string;
    SoulboundIdentityAddress: string;
    SoulboundCreditReportAddress: string;
    SoulNameAddress: string;
    SoulStoreAddress: string;
    SoulLinkerAddress: string;
  };
}

export const addresses: Addresses = {
  goerli,
};
