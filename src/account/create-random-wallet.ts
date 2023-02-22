import { providers, Wallet } from "ethers";

export const createRandomWallet = (): Wallet => {
  console.info("Creating random wallet!");
  const wallet = Wallet.createRandom();

  wallet.connect(
    new providers.JsonRpcProvider("https://rpc.ankr.com/eth_goerli")
  );
  return wallet;
};
