export const unpackSessionId = (cookie?: string): string | undefined => {
  return cookie?.split(";")[0].split("=")[1];
};
