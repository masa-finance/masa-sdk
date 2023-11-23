import { LogDescription } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import { ReferenceSBTAuthority } from "@masa-finance/masa-contracts-identity";
import { PayableOverrides } from "ethers";

import { Messages } from "../../../../collections";
import type {
  BaseResult,
  BaseResultWithTokenId,
  PaymentMethod,
} from "../../../../interface";
import { isNativeCurrency } from "../../../../utils";
import { SBTContractWrapper } from "../SBT/sbt-contract-wrapper";

export class ASBTContractWrapper<
  Contract extends ReferenceSBTAuthority,
> extends SBTContractWrapper<Contract> {
  /**
   *
   * @param paymentMethod
   * @param receiver
   */
  public mint = async (
    paymentMethod: PaymentMethod,
    receiver: string,
  ): Promise<BaseResultWithTokenId> => {
    const result: BaseResultWithTokenId = { success: false };

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
        result.message = `Minting of ASBT failed: '${receiver}' exceeded the limit of '${limit}'!`;
        console.error(result.message);
        return result;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.warn(`Loading SBT balance failed! ${error.message}`);
      }
    }

    const { price, paymentAddress } = await this.getPrice(paymentMethod);

    const mintASBTArguments: [
      string, // paymentAddress string
      string, // receiver string
    ] = [paymentAddress, receiver];

    const mintASBTOverrides: PayableOverrides = await this.createOverrides(
      isNativeCurrency(paymentMethod) ? price : undefined,
    );

    if (this.masa.config.verbose) {
      console.info(mintASBTArguments, mintASBTOverrides);
    }

    const {
      "mint(address,address)": mint,
      estimateGas: { "mint(address,address)": estimateGas },
    } = this.contract;

    try {
      const gasLimit = await this.estimateGasWithSlippage(
        estimateGas,
        mintASBTArguments,
        mintASBTOverrides,
      );

      const { wait, hash } = await mint(...mintASBTArguments, {
        ...mintASBTOverrides,
        gasLimit,
      });

      console.log(
        Messages.WaitingToFinalize(
          hash,
          this.masa.config.network?.blockExplorerUrls?.[0],
        ),
      );

      const { logs } = await wait();

      const parsedLogs = this.masa.contracts.parseLogs(logs, [this.contract]);

      const mintEvent = parsedLogs.find(
        (log: LogDescription) => log.name === "Mint",
      );

      if (mintEvent) {
        const { args } = mintEvent;
        console.log(
          `Minted to token with ID: ${args._tokenId} receiver '${args._owner}'`,
        );

        result.success = true;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        result.message = `Minting ASBT failed! ${error.message}`;
        console.error(result.message);
      }
    }

    return result;
  };

  /**
   *
   * @param paymentMethod
   * @param receivers
   */
  public bulkMint = async (
    paymentMethod: PaymentMethod,
    receivers: string[],
  ): Promise<BaseResult[]> => {
    const result: BaseResult[] = [];

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
          const errorMessage = `Minting of ASBT failed: '${receiver}' exceeded the limit of '${limit}'!`;
          console.error(errorMessage);
          result.push({ success: false, message: errorMessage });
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.warn(`Loading SBT balance failed! ${error.message}`);
        }
      }
    }

    const { price, paymentAddress } = await this.getPrice(paymentMethod);

    const mintASBTArguments: [
      string, // paymentAddress string
      string[], // receivers string[]
    ] = [paymentAddress, receivers];

    const mintASBTOverrides: PayableOverrides = await this.createOverrides(
      isNativeCurrency(paymentMethod) ? price : undefined,
    );

    if (this.masa.config.verbose) {
      console.info(mintASBTArguments, mintASBTOverrides);
    }

    const {
      "mint(address,address[])": mint,
      estimateGas: { "mint(address,address[])": estimateGas },
    } = this.contract;

    const gasLimit = await this.estimateGasWithSlippage(
      estimateGas,
      mintASBTArguments,
      mintASBTOverrides,
    );

    const { wait, hash } = await mint(...mintASBTArguments, {
      ...mintASBTOverrides,
      gasLimit,
    });

    console.log(
      Messages.WaitingToFinalize(
        hash,
        this.masa.config.network?.blockExplorerUrls?.[0],
      ),
    );

    const { logs } = await wait();

    const parsedLogs = this.masa.contracts.parseLogs(logs, [this.contract]);

    const mintEvent = parsedLogs.find(
      (log: LogDescription) => log.name === "Mint",
    );

    if (mintEvent) {
      const { args } = mintEvent;
      console.log(
        `Minted to token with ID: ${args._tokenId} receiver '${args._owner}'`,
      );

      result.push({ success: true });
    }

    return result;
  };
}
