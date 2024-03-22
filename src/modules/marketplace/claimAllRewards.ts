import type { BaseResult, MasaInterface } from "../../interface";

export const claimAllRewards = async (masa: MasaInterface): Promise<BaseResult> => {
  let success = true;
  let messages: string[] = [];

  for (const contractInstance of Object.values(masa.marketplace)) {
    try {
      const result = await contractInstance.claimAllRewards();
      if (!result.success) {
        success = false;
      }
      messages.push(result.message);
    } catch (error) {
      success = false;
      if (error instanceof Error) {
        messages.push(error.message);
      }
    }
  }

  return {
    success,
    message: messages.join('\n'), // Combine all messages with a newline
  };
};