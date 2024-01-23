import type { NetworkName } from "../interface";

export const Messages = {
  NoIdentity: (address?: string): string =>
    `No Identity found for address '${address}'`,
  WaitingToFinalize: (txHash: string, explorerUrl?: string): string =>
    `Waiting for transaction '${txHash}' to finalize!${
      explorerUrl ? ` Explorer: ${explorerUrl}/tx/${txHash}` : ""
    }`,
  NotLoggedIn: (): string => "Not logged in, please login first!",
  ContractNotDeployed: (networkName: NetworkName): string =>
    `Contract not Deployed to network '${networkName}'!`,
};
