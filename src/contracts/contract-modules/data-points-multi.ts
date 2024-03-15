import { BigNumber, ContractTransaction, Signer, CallOverrides, Overrides, BytesLike } from "ethers";
import { Provider } from "@ethersproject/providers";
import { DataPointsMulti as DataPointsMultiContractInterface, DataPointsMulti } from "@masa-finance/masa-contracts-marketplace/dist/typechain/contracts/DataPointsMulti";

export class DataPointsMultiContract {
  private contract: DataPointsMultiContractInterface;

  constructor(contract: DataPointsMultiContractInterface) {
    this.contract = contract;
  }

  public async balanceOf(account: string, id: BigNumber): Promise<BigNumber> {
    return this.contract.balanceOf(account, id);
  }

  public async balanceOfBatch(
    accounts: string[],
    ids: BigNumber[]
  ): Promise<BigNumber[]> {
    return this.contract.balanceOfBatch(accounts, ids);
  }

  public async getUserBalances(
    user: string
  ): Promise<DataPointsMulti.TokenBalanceStructOutput[]> {
    return this.contract.getUserBalances(user);
  }

  public async getTokenName(id: BigNumber): Promise<string> {
    return this.contract.getTokenName(id);
  }

  public async setTokenName(
    id: BigNumber,
    name: string,
    signer: Signer
  ): Promise<ContractTransaction> {
    return this.contract.connect(signer).setTokenName(id, name);
  }

  public async batchMint(
    toAddresses: string[],
    ids: BigNumber[],
    uuids: BigNumber[],
    signer: Signer
  ): Promise<ContractTransaction> {
    return this.contract.connect(signer).batchMint(toAddresses, ids, uuids);
  }

  public async getAccountTokenUUIDs(
    account: string,
    id: BigNumber
  ): Promise<BigNumber[]> {
    return this.contract.getAccountTokenUUIDs(account, id);
  }

  public async getRoleAdmin(role: BytesLike): Promise<string> {
    return this.contract.getRoleAdmin(role);
  }

  public async grantRole(
    role: BytesLike,
    account: string,
    signer: Signer
  ): Promise<ContractTransaction> {
    return this.contract.connect(signer).grantRole(role, account);
  }

  public async hasRole(role: BytesLike, account: string): Promise<boolean> {
    return this.contract.hasRole(role, account);
  }

  public async renounceRole(
    role: BytesLike,
    account: string,
    signer: Signer
  ): Promise<ContractTransaction> {
    return this.contract.connect(signer).renounceRole(role, account);
  }

  public async revokeRole(
    role: BytesLike,
    account: string,
    signer: Signer
  ): Promise<ContractTransaction> {
    return this.contract.connect(signer).revokeRole(role, account);
  }

  public async setApprovalForAll(
    operator: string,
    approved: boolean,
    signer: Signer
  ): Promise<ContractTransaction> {
    return this.contract.connect(signer).setApprovalForAll(operator, approved);
  }

  public async setBaseURI(
    newBaseURI: string,
    signer: Signer
  ): Promise<ContractTransaction> {
    return this.contract.connect(signer).setBaseURI(newBaseURI);
  }

  public async setTokenMetadata(
    tokenId: BigNumber,
    name: string,
    image: string,
    description: string,
    signer: Signer
  ): Promise<ContractTransaction> {
    return this.contract
      .connect(signer)
      .setTokenMetadata(tokenId, name, image, description);
  }

  public async setupRole(
    role: BytesLike,
    account: string,
    signer: Signer
  ): Promise<ContractTransaction> {
    return this.contract.connect(signer).setupRole(role, account);
  }

  public async supportsInterface(interfaceId: BytesLike): Promise<boolean> {
    return this.contract.supportsInterface(interfaceId);
  }

  public async uri(tokenId: BigNumber): Promise<string> {
    return this.contract.uri(tokenId);
  }

  public attach(address: string): DataPointsMultiContract {
    const attachedContract = this.contract.attach(
      address
    ) as DataPointsMultiContractInterface;
    return new DataPointsMultiContract(attachedContract);
  }

  public connect(
    signerOrProvider: Signer | Provider | string
  ): DataPointsMultiContract {
    const connectedContract = this.contract.connect(
      signerOrProvider
    ) as DataPointsMultiContractInterface;
    return new DataPointsMultiContract(connectedContract);
  }
}
