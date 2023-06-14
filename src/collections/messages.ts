import type { NetworkName } from "../interface";

export const Messages = {
  NoIdentity: (address?: string) =>
    `No Identity found for address '${address}'`,
  WaitingToFinalize: (txHash: string, explorerUrl?: string) =>
    `Waiting for transaction '${txHash}' to finalize!${
      explorerUrl ? ` Explorer: ${explorerUrl}/tx/${txHash}` : ""
    }`,
  NotLoggedIn: () => "Not logged in, please login first!",
  ContractNotDeployed: (networkName: NetworkName) =>
    `Contract not Deployed to network '${networkName}'!`,
};
