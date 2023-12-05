import type { MasaSBT } from "@masa-finance/masa-contracts-identity";
import type { BigNumber } from "ethers";

import { BaseResult } from "../../../interface";
import { isBigNumber, logger, patchMetadataUrl } from "../../../utils";
import { MasaLinkable } from "../../masa-linkable";

export class MasaSBTWrapper<
  Contract extends MasaSBT,
> extends MasaLinkable<Contract> {
  /**
   *
   * @param address
   */
  public list = async (
    address?: string,
  ): Promise<
    {
      tokenId: BigNumber;
      tokenUri: string;
    }[]
  > => {
    address = address || (await this.masa.config.signer.getAddress());

    const SBTs = await this.loadSBTs(address);

    if (SBTs.length === 0) {
      logger(
        "log",
        `No SBTs found on contract '${await this.contract.name()}' (${
          this.contract.address
        })`,
      );
    }

    let i = 1;
    for (const SBT of SBTs) {
      logger("log", `Token: ${i}`);
      logger("log", `Token ID: ${SBT.tokenId}`);
      logger("log", `Metadata: ${SBT.tokenUri}`);

      i++;
    }

    return SBTs;
  };

  /**
   *
   * @param identityIdOrAddress
   */
  protected loadSBTs = async (
    identityIdOrAddress: BigNumber | string,
  ): Promise<
    {
      tokenId: BigNumber;
      tokenUri: string;
    }[]
  > => {
    let SBTIDs: BigNumber[] = [];

    try {
      // do we have a soul linker here? use it!
      if (this.masa.contracts.instances.SoulLinkerContract.hasAddress) {
        const {
          "getSBTConnections(address,address)": getSBTConnectionsByAddress,
          "getSBTConnections(uint256,address)": getSBTConnectionsByIdentity,
        } = this.masa.contracts.instances.SoulLinkerContract;

        SBTIDs = await (isBigNumber(identityIdOrAddress)
          ? getSBTConnectionsByIdentity(
              identityIdOrAddress,
              this.contract.address,
            )
          : getSBTConnectionsByAddress(
              identityIdOrAddress,
              this.contract.address,
            ));
      }
      // no soul linker, lets try by identity or address
      else {
        let identityAddress: string;

        if (isBigNumber(identityIdOrAddress)) {
          identityAddress =
            await this.masa.contracts.instances.SoulboundIdentityContract[
              "ownerOf(uint256)"
            ](identityIdOrAddress);
        } else {
          identityAddress = identityIdOrAddress as string;
        }

        const balance: number = (
          await this.contract.balanceOf(identityAddress)
        ).toNumber();

        if (balance > 0) {
          for (let i = 0; i < balance; i++) {
            SBTIDs.push(
              await this.contract.tokenOfOwnerByIndex(identityAddress, i),
            );
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger("error", `Loading SBTs failed! ${error.message}`);
      }
    }

    return await this.loadSBTIDs(SBTIDs);
  };

  /**
   *
   * @param sbtIDs
   */
  protected loadSBTIDs = async (
    sbtIDs: BigNumber[],
  ): Promise<
    {
      tokenId: BigNumber;
      tokenUri: string;
    }[]
  > => {
    return await Promise.all(
      sbtIDs.map(async (tokenId: BigNumber) => {
        const tokenUri = patchMetadataUrl(
          this.masa,
          await this.contract.tokenURI(tokenId),
        );

        return {
          tokenId,
          tokenUri,
        };
      }),
    );
  };

  /**
   *
   * @param SBTId
   */
  public burn = async (SBTId: BigNumber): Promise<BaseResult> => {
    logger("log", `Burning SBT with ID '${SBTId}'!`);

    const { burn } = this.masa.contracts.sbt.attach(this.contract);

    const burned = await burn(SBTId);

    if (burned) {
      logger("log", `Burned SBT with ID '${SBTId.toNumber()}'!`);
    }
    return burned;
  };
}
