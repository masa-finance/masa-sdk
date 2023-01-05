import Masa from "../masa";
import GraphemeSplitter from "grapheme-splitter";

export const calculateSoulNameLength = (soulName: string) => {
  return new GraphemeSplitter().countGraphemes(soulName);
};

export const validateSoulName = (
  masa: Masa,
  soulName: string
): { isValid: boolean; length: number; message?: string } => {
  let isValid = true;
  const regex = /^[A-Za-z0-9.-]*$/;
  const emojiRegex = /\p{Emoji}/u;
  const length = calculateSoulNameLength(soulName);

  if (length < 1) {
    isValid = false;
    return {
      isValid,
      length,
      message: "Soulname must be at least 1 character long",
    };
  }

  if (soulName.includes(" ")) {
    isValid = false;
    return {
      isValid,
      length,
      message: "Soulname can not include spaces",
    };
  }

  if (!regex.test(soulName) && !emojiRegex.test(soulName)) {
    isValid = false;
    return {
      isValid,
      length,
      message: "Soulname must contain only alphanumeric characters",
    };
  }

  return {
    isValid,
    length,
  };
};
