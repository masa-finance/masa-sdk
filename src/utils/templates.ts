export const Templates = {
  /**
   * The Masa Finance Login Template used for authenticating with the middleware
   * @param challenge The challenge received from the login process
   * @param expires The session expiration date received from the login process
   */
  loginTemplate: (
    challenge: string,
    expires: string
  ) => `Welcome to 🌽Masa Finance!

Login with your soulbound web3 identity to unleash the power of DeFi.

Your signature is valid till: ${expires}.
Challenge: ${challenge}`,
};
