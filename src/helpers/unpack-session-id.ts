export const unpackSessionId = (cookie?: string): string | undefined => {
  if (!cookie) return;

  return cookie?.split(";")[0].split("=")[1];
};
