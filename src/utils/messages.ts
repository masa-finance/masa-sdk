import { NetworkName } from "../interface";

export const Messages = {
  NoIdentity: (address?: string) =>
    `No Identity found for address '${address}'`,
  WaitingToFinalize: (txHash: string) =>
    `Waiting for transaction '${txHash}' to finalize!`,
  NotLoggedIn: () => "Not logged in, please login first!",
  ContractNotDeployed: (networkName: NetworkName) =>
    `Contract not Deployed to network '${networkName}'!`,
};
