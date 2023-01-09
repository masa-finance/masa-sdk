import Masa from "../masa";
import GraphemeSplitter from "grapheme-splitter";

export const calculateSoulNameLength = (soulName: string) => {
  return new GraphemeSplitter().countGraphemes(soulName);
};

export const validateSoulName = (
  masa: Masa,
  soulName: string
): { isValid: boolean; length: number; message?: string } => {
  const result: { isValid: boolean; length: number; message?: string } = {
    isValid: false,
    length: calculateSoulNameLength(soulName),
  };
  const alphanumericRegex = /^[A-Za-z0-9.-]*$/;
  const emojiRegex = /\p{Emoji}/u;

  if (result.length < 1) {
    result.message = "Soulname must be at least 1 character long";
    return result;
  }

  if (soulName.includes(" ")) {
    result.message = "Soulname can not include spaces";
    return result;
  }

  if (!alphanumericRegex.test(soulName) && !emojiRegex.test(soulName)) {
    result.message =
      "Soulname must contain only alphanumeric or emoji characters";

    return result;
  }

  result.isValid = true;

  return result;
};
