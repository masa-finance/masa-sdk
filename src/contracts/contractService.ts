import { BigNumber } from "@ethersproject/bignumber";
import { MASA__factory } from "@masa-finance/masa-contracts-identity";
import { ContractReceipt, ContractTransaction, ethers, Signer } from "ethers";
import { addresses } from "./index";
import { IIdentityContracts } from "../interface";
import Masa from "../masa";

export type PaymentMethod = "eth" | "weth" | "stable" | "utility";

export class ContractService {
  constructor(private masa: Masa) {}

  getPaymentAddress(paymentMethod: PaymentMethod) {
    let paymentAddress = ethers.constants.AddressZero;

    switch (paymentMethod) {
      case "utility":
        paymentAddress = addresses[this.masa.config.network].MASA;
        break;
      case "stable":
        paymentAddress = addresses[this.masa.config.network].USDC;
        break;
      case "weth":
        paymentAddress = addresses[this.masa.config.network].WETH;
        break;
    }

    return paymentAddress;
  }

  async getSoulNames(
    identityContracts: IIdentityContracts,
    address: string
  ): Promise<string[]> {
    const soulNames = await identityContracts.SoulboundIdentityContract[
      "getSoulNames(address)"
    ](address);

    console.log("Soul names", soulNames);
    return soulNames;
  }

  async isAvailable(
    identityContracts: IIdentityContracts,
    name: string
  ): Promise<boolean> {
    return identityContracts.SoulNameContract.isAvailable(name);
  }

  // purchase only identity
  async purchaseIdentity(
    identityContracts: IIdentityContracts,
    signer: Signer
  ): Promise<ContractTransaction> {
    return identityContracts.SoulStoreContract.connect(
      signer
    ).purchaseIdentity();
  }

  // purchase only identity with name
  async purchaseIdentityAndName(
    identityContracts: IIdentityContracts,
    signer: Signer,
    name: string,
    paymentMethod: PaymentMethod,
    duration = 1,
    metadataURL: string
  ): Promise<ContractTransaction> {
    const prices = await identityContracts.SoulStoreContract.purchaseNameInfo(
      name,
      duration
    );

    const paymentAddress = this.getPaymentAddress(paymentMethod);

    await this.checkOrGiveAllowance(
      identityContracts,
      paymentAddress,
      signer,

      paymentMethod,
      prices
    );

    const tx = await identityContracts.SoulStoreContract.connect(
      signer
    ).purchaseIdentityAndName(paymentAddress, name, duration, metadataURL, {
      value: paymentMethod === "eth" ? prices.priceInETH : undefined,
      gasLimit: 21000

    });

    return tx;
  }

  // purchase only name
  async purchaseName(
    identityContracts: IIdentityContracts,
    signer: Signer,
    name: string,
    paymentMethod: PaymentMethod,
    duration = 1,
    metadataURL: string
  ): Promise<ContractTransaction> {
    const prices = await identityContracts.SoulStoreContract.purchaseNameInfo(
      name,
      duration
    );

    const paymentAddress = this.getPaymentAddress(paymentMethod);

    await this.checkOrGiveAllowance(
      identityContracts,
      paymentAddress,
      signer,

      paymentMethod,
      prices
    );

    const tx = identityContracts.SoulStoreContract.connect(signer).purchaseName(
      paymentAddress,
      name,
      duration,
      metadataURL,
      {
        value: paymentMethod === "eth" ? prices.priceInETH : undefined,
        gasLimit: 21000
      }
    );

    return tx;
  }

  private async checkOrGiveAllowance(
    identityContracts: IIdentityContracts,
    paymentAddress: string,
    signer: Signer,
    paymentMethod: PaymentMethod,
    prices: {
      priceInStableCoin: BigNumber;
      priceInETH: BigNumber;
      priceInUtilityToken: BigNumber;
    }
  ): Promise<ContractReceipt | undefined> {
    if (paymentMethod !== "eth") {
      const contract = MASA__factory.connect(paymentAddress, signer);

      const paymentAmount =
        paymentMethod === "stable"
          ? prices.priceInStableCoin
          : paymentMethod === "utility"
          ? prices.priceInUtilityToken
          : prices.priceInETH;

      if (
        (await contract.allowance(
          // owner
          await signer.getAddress(),
          // spender
          identityContracts.SoulStoreContract.address
        )) < paymentAmount
      ) {
        const tx: ContractTransaction = await contract.connect(signer).approve(
          // spender
          identityContracts.SoulStoreContract.address,
          // amount
          paymentAmount
        );

        return await tx.wait();
      }
    }
  }

  async price(
    identityContracts: IIdentityContracts,
    name: string,
    duration = 1
  ) {
    return identityContracts.SoulStoreContract.purchaseNameInfo(name, duration);
  }
}
