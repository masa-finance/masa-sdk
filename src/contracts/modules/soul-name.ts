import { isNativeCurrency, PaymentMethod } from "../../interface";
import { ContractTransaction, TypedDataDomain, Wallet } from "ethers";
import { generateSignatureDomain, signTypedData } from "../../utils";
import { BigNumber } from "@ethersproject/bignumber";
import { MasaModuleBase } from "./masa-module-base";

export class SoulName extends MasaModuleBase {
  /**
   *
   */
  types = {
    MintSoulName: [
      { name: "to", type: "address" },
      { name: "name", type: "string" },
      { name: "nameLength", type: "uint256" },
      { name: "yearsPeriod", type: "uint256" },
      { name: "tokenURI", type: "string" },
    ],
  };

  /**
   * Check if a soul name is available
   * @param soulName
   */
  isAvailable = async (soulName: string): Promise<boolean> => {
    let available = false;
    if (soulName && soulName.length > 0) {
      available = await this.instances.SoulNameContract.isAvailable(soulName);
    }
    return available;
  };

  /**
   * purchase only name
   * @param paymentMethod
   * @param name
   * @param nameLength
   * @param duration
   * @param metadataURL
   * @param authorityAddress
   * @param signature
   * @param receiver
   */
  purchase = async (
    paymentMethod: PaymentMethod,
    name: string,
    nameLength: number,
    duration: number = 1,
    metadataURL: string,
    authorityAddress: string,
    signature: string,
    receiver?: string
  ): Promise<ContractTransaction> => {
    const to = receiver || (await this.masa.config.wallet.getAddress());

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
      to,
      name,
      nameLength,
      yearsPeriod: duration,
      tokenURI: metadataURL,
    };

    await this.verify(
      "Verifying soul name failed!",
      this.instances.SoulStoreContract,
      domain,
      this.types,
      value,
      signature,
      authorityAddress
    );

    const { price, paymentAddress } = await this.getPrice(
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

    const purchaseNameParameters: [
      string, // paymentMethod: PromiseOrValue<string>
      string, // to: PromiseOrValue<string>
      string, // name: PromiseOrValue<string>
      number, // nameLength: PromiseOrValue<BigNumberish>
      number, // yearsPeriod: PromiseOrValue<BigNumberish>
      string, // tokenURI: PromiseOrValue<string>
      string, // authorityAddress: PromiseOrValue<string>
      string // signature: PromiseOrValue<BytesLike>
    ] = [
      paymentAddress,
      to,
      name,
      nameLength,
      duration,
      metadataURL,
      authorityAddress,
      signature,
    ];

    const purchaseNameOverrides = {
      value: isNativeCurrency(paymentMethod) ? price : undefined,
    };

    if (this.masa.config.verbose) {
      console.log({ purchaseNameParameters, purchaseNameOverrides });
    }

    // connect
    const soulStore = this.instances.SoulStoreContract.connect(
      this.masa.config.wallet
    );

    // estimate gas
    const gasLimit = await soulStore.estimateGas.purchaseName(
      ...purchaseNameParameters,
      purchaseNameOverrides
    );

    // execute
    return await soulStore.purchaseName(...purchaseNameParameters, {
      ...purchaseNameOverrides,
      gasLimit,
    });
  };

  /**
   * Get price for minting a soul name
   * @param paymentMethod
   * @param nameLength
   * @param duration
   * @param slippage
   */
  getPrice = async (
    paymentMethod: PaymentMethod,
    nameLength: number,
    duration: number = 1,
    // slippage in bps where 10000 is 100%. 250 would be 2,5%
    slippage: number | undefined = 250
  ): Promise<{
    price: BigNumber;
    paymentAddress: string;
    formattedPrice: string;
  }> => {
    const paymentAddress = this.getPaymentAddress(paymentMethod);

    let price = await this.instances.SoulStoreContract.getPriceForMintingName(
      paymentAddress,
      nameLength,
      duration
    );

    if (slippage) {
      if (isNativeCurrency(paymentMethod)) {
        price = this.addSlippage(price, slippage);
      }
    }

    const formattedPrice = await this.formatPrice(paymentAddress, price);

    return {
      price,
      paymentAddress,
      formattedPrice,
    };
  };

  /**
   * Returns detailed information for a soul name
   * @param soulName
   */
  getSoulnameData = async (
    soulName: string
  ): Promise<{ exists: boolean; tokenId: BigNumber }> => {
    return await this.instances.SoulNameContract.nameData(
      soulName.toLowerCase()
    );
  };

  /**
   * signs a soul name
   * @param soulName
   * @param soulNameLength
   * @param duration
   * @param metadataUrl
   * @param receiver
   */
  sign = async (
    soulName: string,
    soulNameLength: number,
    duration: number,
    metadataUrl: string,
    receiver: string
  ): Promise<
    | {
        signature: string;
        authorityAddress: string;
      }
    | undefined
  > => {
    const value: {
      to: string;
      name: string;
      nameLength: number;
      yearsPeriod: number;
      tokenURI: string;
    } = {
      to: receiver,
      name: soulName,
      nameLength: soulNameLength,
      yearsPeriod: duration,
      tokenURI: metadataUrl,
    };

    const { signature, domain } = await signTypedData(
      this.instances.SoulStoreContract,
      this.masa.config.wallet as Wallet,
      "SoulStore",
      this.types,
      value
    );

    const authorityAddress = await this.masa.config.wallet.getAddress();

    await this.verify(
      "Signing soul name failed!",
      this.instances.SoulStoreContract,
      domain,
      this.types,
      value,
      signature,
      authorityAddress
    );

    return { signature, authorityAddress };
  };
}
