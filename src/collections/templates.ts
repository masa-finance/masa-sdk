export const Templates = {
  /**
   * The Masa Finance Login Template used for authenticating with masa-express
   *
   * @param challenge The challenge received from the login process
   * @param expires The session expiration date received from the login process
   */
  loginTemplate: (
    challenge: string,
    expires: string,
  ) => `Welcome to 🌽Masa Finance!

Login with your soulbound web3 identity to unleash the power of DeFi.

Your signature is valid till: ${expires}.
Challenge: ${challenge}`,

  /**
   * The Masa Finance Login rotation Template used for authenticating with masa-express
   *
   * @param challenge The challenge received from the login process
   * @param expires The session expiration date received from the login process
   */
  loginTemplateNext: (
    challenge: string,
    expires: string,
  ) => `Welcome to the Masa Network 🪐

Login to the Masa App to join the Masa AI Data Network. Start staking MASA and unleash the power of AI.

Your signature is valid till: ${expires}.
Challenge: ${challenge}`,
};
