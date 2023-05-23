import { ethers } from "ethers";
import { Masa } from "../../src";

const provider = new ethers.providers.JsonRpcProvider(
  "your blockchain rpc endpoint"
);

export const testMasa = new Masa({
  signer: provider.getSigner(),
});
