export const unpackSessionId = (cookie?: string): string | undefined => {
  let result = undefined;

  if (!cookie) {
    return result;
  }

  result = cookie?.split(";")[0].split("=")[1];
  return result;
};
