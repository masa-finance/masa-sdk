export const getLoginTemplate = (
  challenge: string,
  expires: string
) => `Welcome to 🌽Masa Finance!

Login with your soulbound web3 identity to unleash the power of DeFi.

Your signature is valid till: ${expires}.
Challenge: ${challenge}`;
