import Masa from "../masa";

export const validateSoulName = (
  masa: Masa,
  soulName: string
): { isValid: boolean; message?: string } => {
  let isValid = true;
  const regex = /^[A-Za-z0-9.-]*$/;
  const emojiRegex = /\p{Emoji}/u;

  if (soulName.length < 1) {
    isValid = false;
    return {
      isValid,
      message: "Soulname must be at least 1 character long",
    };
  }

  if (soulName.includes(" ")) {
    isValid = false;
    return {
      isValid,
      message: "Soulname can not include spaces",
    };
  }

  if (!regex.test(soulName) && !emojiRegex.test(soulName)) {
    isValid = false;
    return {
      isValid,
      message: "Soulname must contain only alphanumeric characters",
    };
  }

  return {
    isValid,
  };
};
