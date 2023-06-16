import {
  BigNumber,
  ContractTransaction,
  PayableOverrides,
  TypedDataDomain,
} from "ethers";

import { MasaSBTModuleBase } from "../../base/masa-sbt-module-base";
import { Messages } from "../../collections";
import type { PaymentMethod } from "../../interface";
import { generateSignatureDomain, isNativeCurrency } from "../../utils";

export class Identity extends MasaSBTModuleBase {
  /**
   * purchase only identity
   */
  public purchase = async (): Promise<ContractTransaction> => {
    const {
      estimateGas: { purchaseIdentity: estimateGas },
      purchaseIdentity,
    } = this.instances.SoulStoreContract;

    // estimate gas
    let gasLimit: BigNumber = await estimateGas();

    if (this.masa.config.network?.gasSlippagePercentage) {
      gasLimit = Identity.addSlippage(
        gasLimit,
        this.masa.config.network.gasSlippagePercentage
      );
    }

    return await purchaseIdentity({ gasLimit });
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
  public purchaseIdentityAndName = async (
    paymentMethod: PaymentMethod,
    name: string,
    nameLength: number,
    duration: number = 1,
    metadataURL: string,
    authorityAddress: string,
    signature: string
  ): Promise<ContractTransaction> => {
    const domain: TypedDataDomain = await generateSignatureDomain(
      this.masa.config.signer,
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
      to: await this.masa.config.signer.getAddress(),
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
      string // signature: PromiseOrValue<BytesLike>
    ] = [
      paymentAddress,
      name,
      nameLength,
      duration,
      metadataURL,
      authorityAddress,
      signature,
    ];

    const purchaseIdentityAndNameOverrides: PayableOverrides =
      await this.createOverrides(
        isNativeCurrency(paymentMethod) ? price : undefined
      );

    if (this.masa.config.verbose) {
      console.log({
        purchaseIdentityAndNameParameters,
        purchaseIdentityAndNameOverrides,
      });
    }

    // connect
    const {
      estimateGas: { purchaseIdentityAndName: estimateGas },
      purchaseIdentityAndName,
    } = this.instances.SoulStoreContract;

    // estimate gas
    let gasLimit: BigNumber = await estimateGas(
      ...purchaseIdentityAndNameParameters,
      purchaseIdentityAndNameOverrides
    );

    if (this.masa.config.network?.gasSlippagePercentage) {
      gasLimit = Identity.addSlippage(
        gasLimit,
        this.masa.config.network.gasSlippagePercentage
      );
    }

    // execute tx
    return await purchaseIdentityAndName(...purchaseIdentityAndNameParameters, {
      ...purchaseIdentityAndNameOverrides,
      gasLimit,
    });
  };

  /**
   *
   * @param identityId
   */
  public burn = async (identityId: BigNumber): Promise<boolean> => {
    let success = false;

    console.log(`Burning Identity with ID '${identityId}'!`);
    try {
      const {
        estimateGas: { burn: estimateGas },
        burn,
      } = this.masa.contracts.instances.SoulboundIdentityContract.connect(
        this.masa.config.signer
      );

      // estimate gas
      let gasLimit: BigNumber = await estimateGas(identityId);

      if (this.masa.config.network?.gasSlippagePercentage) {
        gasLimit = Identity.addSlippage(
          gasLimit,
          this.masa.config.network.gasSlippagePercentage
        );
      }

      const { wait, hash } = await burn(identityId, { gasLimit });

      console.log(
        Messages.WaitingToFinalize(
          hash,
          this.masa.config.network?.blockExplorerUrls?.[0]
        )
      );

      await wait();

      console.log(`Burned Identity with ID '${identityId}'!`);
      success = true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Burning Identity Failed! ${error.message}`);
      }
    }

    return success;
  };
}
