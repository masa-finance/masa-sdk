import { BigNumber } from "@ethersproject/bignumber";
import { MASA__factory } from "@masa-finance/masa-contracts-identity";
import { ContractReceipt, ContractTransaction, ethers, Signer } from "ethers";
import { addresses, loadIdentityContracts } from "./index";
import { IIdentityContracts, MasaConfig } from "../interface";

export type PaymentMethod = "eth" | "weth" | "stable" | "utility";

export class MasaContracts {
  public identity: IIdentityContracts;

  public constructor(private masaConfig: MasaConfig) {
    this.identity = loadIdentityContracts({
      provider: masaConfig.wallet.provider,
      network: masaConfig.network,
    });
  }

  getPaymentAddress(paymentMethod: PaymentMethod) {
    let paymentAddress = ethers.constants.AddressZero;

    switch (paymentMethod) {
      case "utility":
        paymentAddress = addresses[this.masaConfig.network].MASA;
        break;
      case "stable":
        paymentAddress = addresses[this.masaConfig.network].USDC;
        break;
      case "weth":
        paymentAddress = addresses[this.masaConfig.network].WETH;
        break;
    }

    return paymentAddress;
  }

  async getSoulNames(address: string): Promise<string[]> {
    const soulNames = await this.identity.SoulboundIdentityContract[
      "getSoulNames(address)"
    ](address);

    console.log("Soul names", soulNames);
    return soulNames;
  }

  async isAvailable(soulName: string): Promise<boolean> {
    let available = false;
    if (soulName && soulName.length > 0) {
      available = await this.identity.SoulNameContract.isAvailable(soulName);
    }
    return available;
  }

  // purchase only identity
  async purchaseIdentity(signer: Signer): Promise<ContractTransaction> {
    return this.identity.SoulStoreContract.connect(signer).purchaseIdentity();
  }

  // purchase only identity with name
  async purchaseIdentityAndName(
    signer: Signer,
    name: string,
    paymentMethod: PaymentMethod,
    duration = 1,
    metadataURL: string
  ): Promise<ContractTransaction> {
    const paymentAddress = this.getPaymentAddress(paymentMethod);

    const price = await this.identity.SoulStoreContract.getPriceForMintingName(
      paymentAddress,
      name,
      duration
    );

    await this.checkOrGiveAllowance(
      paymentAddress,
      signer,

      paymentMethod,
      price
    );

    const tx = await this.identity.SoulStoreContract.connect(
      signer
    ).purchaseIdentityAndName(paymentAddress, name, duration, metadataURL, {
      value: paymentMethod === "eth" ? price : undefined,
    });

    return tx;
  }

  // purchase only name
  async purchaseName(
    signer: Signer,
    name: string,
    paymentMethod: PaymentMethod,
    duration = 1,
    metadataURL: string
  ): Promise<ContractTransaction> {
    const paymentAddress = this.getPaymentAddress(paymentMethod);

    const price = await this.identity.SoulStoreContract.getPriceForMintingName(
      paymentAddress,
      name,
      duration
    );

    await this.checkOrGiveAllowance(
      paymentAddress,
      signer,

      paymentMethod,
      price
    );

    const tx = this.identity.SoulStoreContract.connect(signer).purchaseName(
      paymentAddress,
      name,
      duration,
      metadataURL,
      signer.getAddress(),
      {
        value: paymentMethod === "eth" ? price : undefined,
      }
    );

    return tx;
  }

  private async checkOrGiveAllowance(
    paymentAddress: string,
    signer: Signer,
    paymentMethod: PaymentMethod,
    price: BigNumber
  ): Promise<ContractReceipt | undefined> {
    if (paymentMethod !== "eth") {
      const contract = MASA__factory.connect(paymentAddress, signer);

      if (
        (await contract.allowance(
          // owner
          await signer.getAddress(),
          // spender
          this.identity.SoulStoreContract.address
        )) < price
      ) {
        const tx: ContractTransaction = await contract.connect(signer).approve(
          // spender
          this.identity.SoulStoreContract.address,
          // amount
          price
        );

        return await tx.wait();
      }
    }
  }

  async price(name: string, paymentMethod: PaymentMethod, duration = 1) {
    return this.identity.SoulStoreContract.getPriceForMintingName(
      paymentMethod,
      name,
      duration
    );
  }

  // purchase only identity
  async mintCreditScore(signature: string): Promise<ContractTransaction> {
    return this.identity.SoulboundCreditReportContract.mint()
  }
}
