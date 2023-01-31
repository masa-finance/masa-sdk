export const Messages = {
  NoIdentity: (address?: string) =>
    `No Identity found for address '${address}'`,
  WaitingToFinalize: (txHash: string) =>
    `Waiting for transaction '${txHash}' to finalize!`,
  NotLoggedIn: () => `Not logged in, please login first!`,
};
