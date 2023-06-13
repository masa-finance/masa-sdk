import {
  BigNumber,
  ContractTransaction,
  PayableOverrides,
  TypedDataDomain,
} from "ethers";

import { MasaModuleBase } from "../../base";
import { Messages } from "../../collections";
import type { PaymentMethod } from "../../interface";
import { generateSignatureDomain, isNativeCurrency } from "../../utils";

export class Identity extends MasaModuleBase {
  /**
   * purchase only identity
   */
  purchase = async (): Promise<ContractTransaction> => {
    const {
      estimateGas: { purchaseIdentity: estimateGas },
      purchaseIdentity,
    } = this.instances.SoulStoreContract.connect(this.masa.config.signer);

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

    const feeData = await this.getNetworkFeeInformation();

    const purchaseIdentityAndNameOverrides: PayableOverrides = {
      value: isNativeCurrency(paymentMethod) ? price : undefined,
      ...(feeData && feeData.maxPriorityFeePerGas
        ? {
            maxPriorityFeePerGas: BigNumber.from(feeData.maxPriorityFeePerGas),
          }
        : undefined),
      ...(feeData && feeData.maxFeePerGas
        ? {
            maxFeePerGas: BigNumber.from(feeData.maxFeePerGas),
          }
        : undefined),
    };

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
    } = this.instances.SoulStoreContract.connect(this.masa.config.signer);

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
  burn = async (identityId: BigNumber): Promise<boolean> => {
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

      console.log(Messages.WaitingToFinalize(hash));
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
