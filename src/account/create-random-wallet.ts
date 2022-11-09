import { ethers, Wallet } from "ethers";

export const createRandomWallet = (): Wallet => {
  console.info("Creating random wallet!");
  const wallet = ethers.Wallet.createRandom();

  wallet.connect(
    new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth_goerli")
  );
  return wallet;
};
