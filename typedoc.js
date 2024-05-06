module.exports = {
  entryPoints: ["./src/index.ts"],
  plugin: "typedoc-plugin-markdown",
  name: "Masa SDK",
  out: "docs",
  disableSources: true,
  includeVersion: true,
};
