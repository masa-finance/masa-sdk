import { Wallet } from "ethers";
import { Provider } from "@ethersproject/providers";

export const createRandomWallet = (provider?: Provider): Wallet => {
  console.info("Creating random wallet!");
  const wallet = Wallet.createRandom();

  if (provider) {
    wallet.connect(provider);
  }

  return wallet;
};
