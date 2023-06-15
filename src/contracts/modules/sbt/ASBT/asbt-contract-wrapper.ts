import { LogDescription } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import { ReferenceSBTAuthority } from "@masa-finance/masa-contracts-identity";
import { PayableOverrides } from "ethers";

import { Messages } from "../../../../collections";
import type { PaymentMethod } from "../../../../interface";
import { isNativeCurrency } from "../../../../utils";
import { SBTContractWrapper } from "../SBT";

export class ASBTContractWrapper<
  Contract extends ReferenceSBTAuthority
> extends SBTContractWrapper<Contract> {
  /**
   *
   * @param paymentMethod
   * @param receiver
   */
  mint = async (
    paymentMethod: PaymentMethod,
    receiver: string
  ): Promise<boolean> => {
    // current limit for ASBT is 1 on the default installation
    let limit: number = 1;

    try {
      limit = (await this.contract.maxSBTToMint()).toNumber();
    } catch {
      if (this.masa.config.verbose) {
        console.info("Loading limit failed, falling back to 1!");
      }
    }

    try {
      const balance: BigNumber = await this.contract.balanceOf(receiver);

      if (limit > 0 && balance.gte(limit)) {
        console.error(
          `Minting of ASBT failed: '${receiver}' exceeded the limit of '${limit}'!`
        );
        return false;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.warn(error.message);
      }
    }

    const { price, paymentAddress } = await this.getPrice(paymentMethod);

    const mintASBTArguments: [
      string, // paymentAddress string
      string // receiver string
    ] = [paymentAddress, receiver];

    const feeData = await this.getNetworkFeeInformation();

    const mintASBTOverrides: PayableOverrides = {
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
      console.info(mintASBTArguments, mintASBTOverrides);
    }

    const {
      "mint(address,address)": mint,
      estimateGas: { "mint(address,address)": estimateGas },
    } = this.contract;

    let gasLimit: BigNumber = await estimateGas(
      ...mintASBTArguments,
      mintASBTOverrides
    );

    if (this.masa.config.network?.gasSlippagePercentage) {
      gasLimit = ASBTContractWrapper.addSlippage(
        gasLimit,
        this.masa.config.network.gasSlippagePercentage
      );
    }

    const { wait, hash } = await mint(...mintASBTArguments, {
      ...mintASBTOverrides,
      gasLimit,
    });

    console.log(
      Messages.WaitingToFinalize(
        hash,
        this.masa.config.network?.blockExplorerUrls?.[0]
      )
    );

    const { logs } = await wait();

    const parsedLogs = this.masa.contracts.parseLogs(logs, [this.contract]);

    const mintEvent = parsedLogs.find(
      (log: LogDescription) => log.name === "Mint"
    );

    if (mintEvent) {
      const { args } = mintEvent;
      console.log(
        `Minted to token with ID: ${args._tokenId} receiver '${args._owner}'`
      );

      return true;
    }

    return false;
  };

  /**
   *
   * @param paymentMethod
   * @param receivers
   */
  bulkMint = async (
    paymentMethod: PaymentMethod,
    receivers: string[]
  ): Promise<boolean[]> => {
    const result = [];

    // current limit for ASBT is 1 on the default installation
    let limit: number = 1;

    try {
      limit = (await this.contract.maxSBTToMint()).toNumber();
    } catch {
      if (this.masa.config.verbose) {
        console.info("Loading limit failed, falling back to 1!");
      }
    }

    for (const receiver of receivers) {
      try {
        const balance: BigNumber = await this.contract.balanceOf(receiver);

        if (limit > 0 && balance.gte(limit)) {
          console.error(
            `Minting of ASBT failed: '${receiver}' exceeded the limit of '${limit}'!`
          );
          result.push(false);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.warn(error.message);
        }
      }
    }

    const { price, paymentAddress } = await this.getPrice(paymentMethod);

    const mintASBTArguments: [
      string, // paymentAddress string
      string[] // receivers string[]
    ] = [paymentAddress, receivers];

    const feeData = await this.getNetworkFeeInformation();

    const mintASBTOverrides: PayableOverrides = {
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
      console.info(mintASBTArguments, mintASBTOverrides);
    }

    const {
      "mint(address,address[])": mint,
      estimateGas: { "mint(address,address[])": estimateGas },
    } = this.contract;

    let gasLimit: BigNumber = await estimateGas(
      ...mintASBTArguments,
      mintASBTOverrides
    );

    if (this.masa.config.network?.gasSlippagePercentage) {
      gasLimit = ASBTContractWrapper.addSlippage(
        gasLimit,
        this.masa.config.network.gasSlippagePercentage
      );
    }

    const { wait, hash } = await mint(...mintASBTArguments, {
      ...mintASBTOverrides,
      gasLimit,
    });

    console.log(
      Messages.WaitingToFinalize(
        hash,
        this.masa.config.network?.blockExplorerUrls?.[0]
      )
    );

    const { logs } = await wait();

    const parsedLogs = this.masa.contracts.parseLogs(logs, [this.contract]);

    const mintEvent = parsedLogs.find(
      (log: LogDescription) => log.name === "Mint"
    );

    if (mintEvent) {
      const { args } = mintEvent;
      console.log(
        `Minted to token with ID: ${args._tokenId} receiver '${args._owner}'`
      );

      result.push(true);
    }

    return result;
  };
}
