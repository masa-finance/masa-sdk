import type { FeeData } from "@ethersproject/abstract-provider";
import { BigNumber } from "@ethersproject/bignumber";
import type {
  MasaSBT,
  MasaSBTAuthority,
  MasaSBTSelfSovereign,
  SoulLinker,
  SoulStore,
} from "@masa-finance/masa-contracts-identity";
import type {
  ContractReceipt,
  PayableOverrides,
  TypedDataDomain,
  TypedDataField,
} from "ethers";
import { constants, utils } from "ethers";
import { verifyTypedData } from "ethers/lib/utils";

import { Messages } from "../../collections";
import type {
  IIdentityContracts,
  MasaInterface,
  PaymentMethod,
} from "../../interface";
import { MasaBase } from "../../masa-base";
import type { ERC20 } from "../../stubs";
import { ERC20__factory } from "../../stubs";
import { isERC20Currency, isNativeCurrency } from "../../utils";

export abstract class MasaModuleBase extends MasaBase {
  constructor(masa: MasaInterface, protected instances: IIdentityContracts) {
    super(masa);
  }

  /**
   * Checks or gives allowance on ERC20 tokens
   * @param paymentAddress
   * @param paymentMethod
   * @param spenderAddress
   * @param price
   * @private
   */
  protected checkOrGiveAllowance = async (
    paymentAddress: string,
    paymentMethod: PaymentMethod,
    spenderAddress: string,
    price: BigNumber
  ): Promise<ContractReceipt | undefined> => {
    let contractReceipt;

    if (isERC20Currency(paymentMethod)) {
      const contract: ERC20 = ERC20__factory.connect(
        paymentAddress,
        this.masa.config.signer
      );

      // get current allowance
      const currentAllowance = await contract.allowance(
        // owner
        await this.masa.config.signer.getAddress(),
        // spender
        spenderAddress
      );

      // is price greater the allowance?
      if (price.gt(currentAllowance)) {
        // yes, lets set the allowance to the price

        if (this.masa.config.verbose) {
          console.info(
            `Creating allowance for ${spenderAddress}: ${price.toString()}`
          );
        }

        const { wait, hash } = await contract.approve(
          // spender
          spenderAddress,
          // amount
          price
        );

        if (this.masa.config.verbose) {
          console.info(
            Messages.WaitingToFinalize(
              hash,
              this.masa.config.network?.blockExplorerUrls?.[0]
            )
          );
        }

        contractReceipt = await wait();
      }
    }

    return contractReceipt;
  };

  /**
   * Gets the payment address for a given payment method
   * @param paymentMethod
   * @private
   */
  protected getPaymentAddress = (paymentMethod: PaymentMethod): string => {
    let paymentAddress: string | undefined = isNativeCurrency(paymentMethod)
      ? constants.AddressZero
      : this.masa.config.network?.addresses?.tokens?.[paymentMethod];

    if (!paymentAddress) {
      console.error(
        `Payment address not found for payment method: ${paymentMethod} falling back to native currency!`
      );
      paymentAddress = constants.AddressZero;
    }

    return paymentAddress;
  };

  /**
   *
   * @param value
   */
  protected createOverrides = async (
    value?: BigNumber
  ): Promise<PayableOverrides> => {
    const feeData: FeeData | undefined = await this.getNetworkFeeInformation();

    return {
      value,
      ...(feeData?.maxPriorityFeePerGas
        ? {
            maxPriorityFeePerGas: BigNumber.from(feeData.maxPriorityFeePerGas),
          }
        : undefined),
      ...(feeData?.maxFeePerGas
        ? {
            maxFeePerGas: BigNumber.from(feeData.maxFeePerGas),
          }
        : undefined),
    };
  };

  /**
   *
   */
  protected getNetworkFeeInformation = async (): Promise<
    FeeData | undefined
  > => {
    let result;

    try {
      result = await this.masa.config.signer.provider?.getFeeData();

      if (this.masa.config.verbose) {
        console.dir(
          {
            networkFeeInformation: result,
          },
          {
            depth: null,
          }
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.warn("Unable to get network fee data!", error.message);
      }
    }

    return result;
  };

  /**
   *
   * @param paymentAddress
   * @param price
   */
  protected formatPrice = async (paymentAddress: string, price: BigNumber) => {
    let decimals = 18;
    if (paymentAddress !== constants.AddressZero) {
      const contract: ERC20 = ERC20__factory.connect(
        paymentAddress,
        this.masa.config.signer
      );
      decimals = await contract.decimals();
    }

    return utils.formatUnits(price, decimals);
  };

  /**
   * adds a percentage to the price as slippage
   * @param price
   * @param slippage
   */
  protected static addSlippage = (price: BigNumber, slippage: number) => {
    price = price.add(price.mul(slippage).div(10000));
    return price;
  };

  /**
   * verify a signature created during one of the SBT signing flows
   * @param errorMessage
   * @param domain
   * @param contract
   * @param types
   * @param value
   * @param signature
   * @param authorityAddress
   */
  protected verify = async (
    errorMessage: string,
    contract:
      | MasaSBT
      | MasaSBTSelfSovereign
      | MasaSBTAuthority
      | SoulStore
      | SoulLinker,
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, string | BigNumber | number>,
    signature: string,
    authorityAddress: string
  ) => {
    if (this.masa.config.verbose) {
      console.log({
        domain,
        types: JSON.stringify(types),
        value,
        signature,
        authorityAddress,
      });
    }

    const hasAuthorities = (
      contract:
        | MasaSBT
        | MasaSBTSelfSovereign
        | MasaSBTAuthority
        | SoulStore
        | SoulLinker
    ): contract is MasaSBTSelfSovereign => {
      return (contract as MasaSBTSelfSovereign).authorities !== undefined;
    };

    // first line of defense, check that the address properly recovers
    const recoveredAddress = verifyTypedData(domain, types, value, signature);

    if (this.masa.config.verbose) {
      console.info({
        recoveredAddress,
        authorityAddress,
      });
    }

    // if this fails we throw
    if (recoveredAddress !== authorityAddress) {
      throw new Error(`${errorMessage}: Signature Verification failed!`);
    }

    // second line of defense, if the contract supports authorities
    if (hasAuthorities(contract)) {
      let recoveredAddressIsAuthority = false;

      try {
        recoveredAddressIsAuthority = await contract.authorities(
          recoveredAddress
        );
      } catch (error) {
        if (error instanceof Error)
          console.error(`Retrieving authorities failed! ${error.message}.`);
      }

      if (this.masa.config.verbose) {
        console.info({
          recoveredAddressIsAuthority,
        });
      }

      // we check that the recovered address is within the authorities
      if (!recoveredAddressIsAuthority) {
        throw new Error(
          `${errorMessage}: Authority '${recoveredAddress}' not allowed!`
        );
      }
    }
  };
}
