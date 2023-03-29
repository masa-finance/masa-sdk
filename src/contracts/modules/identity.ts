import { isNativeCurrency, PaymentMethod } from "../../interface";
import { ContractTransaction, TypedDataDomain, Wallet } from "ethers";
import { generateSignatureDomain } from "../../utils";
import { MasaModuleBase } from "./masa-module-base";

export class Identity extends MasaModuleBase {
  /**
   * purchase only identity
   */
  purchase = async (): Promise<ContractTransaction> => {
    return await this.instances.SoulStoreContract.connect(
      this.masa.config.wallet
    ).purchaseIdentity();
  };

  /**
   * purchase identity with name
   * @param paymentMethod
   * @param name
   * @param nameLength
   * @param duration
   * @param metadataURL
   * @param authorityAddress
   * @param signature
   */
  purchaseIdentityAndName = async (
    paymentMethod: PaymentMethod,
    name: string,
    nameLength: number,
    duration: number = 1,
    metadataURL: string,
    authorityAddress: string,
    signature: string
  ): Promise<ContractTransaction> => {
    const domain: TypedDataDomain = await generateSignatureDomain(
      this.masa.config.wallet as Wallet,
      "SoulStore",
      this.instances.SoulStoreContract.address
    );

    const value: {
      to: string;
      name: string;
      nameLength: number;
      yearsPeriod: number;
      tokenURI: string;
    } = {
      to: await this.masa.config.wallet.getAddress(),
      name,
      nameLength,
      yearsPeriod: duration,
      tokenURI: metadataURL,
    };

    await this.verify(
      "Verifying soul name failed!",
      this.instances.SoulStoreContract,
      domain,
      this.masa.contracts.soulName.types,
      value,
      signature,
      authorityAddress
    );

    const { price, paymentAddress } =
      await this.masa.contracts.soulName.getPrice(
        paymentMethod,
        nameLength,
        duration
      );

    await this.checkOrGiveAllowance(
      paymentAddress,
      paymentMethod,
      this.instances.SoulStoreContract.address,
      price
    );

    const purchaseIdentityAndNameParameters: [
      string, // paymentMethod: PromiseOrValue<string>
      string, // name: PromiseOrValue<string>
      number, // nameLength: PromiseOrValue<BigNumberish>
      number, // yearsPeriod: PromiseOrValue<BigNumberish>
      string, // tokenURI: PromiseOrValue<string>
      string, // authorityAddress: PromiseOrValue<string>
      string //signature: PromiseOrValue<BytesLike>
    ] = [
      paymentAddress,
      name,
      nameLength,
      duration,
      metadataURL,
      authorityAddress,
      signature,
    ];

    const purchaseIdentityAndNameOverrides = {
      value: isNativeCurrency(paymentMethod) ? price : undefined,
    };

    if (this.masa.config.verbose) {
      console.log({
        purchaseIdentityAndNameParameters,
        purchaseIdentityAndNameOverrides,
      });
    }

    // connect
    const soulStore = this.instances.SoulStoreContract.connect(
      this.masa.config.wallet
    );

    // estimate gas
    const gasLimit = await soulStore.estimateGas.purchaseIdentityAndName(
      ...purchaseIdentityAndNameParameters,
      purchaseIdentityAndNameOverrides
    );

    // execute tx
    return await soulStore.purchaseIdentityAndName(
      ...purchaseIdentityAndNameParameters,
      {
        ...purchaseIdentityAndNameOverrides,
        gasLimit,
      }
    );
  };
}
