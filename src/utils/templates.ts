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

  /**
   * The Masa Finance Credit Score Template used for creating credit score tokens
   * @param value The value of the credit score
   * @param lastUpdated The date of the credit score generation process
   * @param wallet The address of the wallet used in the credit score generation process
   */
  creditScoreTemplate: (value: string, lastUpdated: string, wallet: string) =>
    `${value};${lastUpdated};${wallet}`,

  /**
   * The Masa Finance 2FA Template used for creating 2FA verification tokens
   * @param identityId The Masa IdentityId of the token receiver
   * @param phoneNumber The phone number used in the verification process
   * @param code The generated security code send to the phone used in the verification process
   */
  twoFATemplate: (identityId: string, phoneNumber: string, code: string) =>
    `Identity: ${identityId} Phone Number: ${phoneNumber} Code: ${code}`,
};
