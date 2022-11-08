"use strict";

const path = require("path");
const { merge } = require("webpack-merge");

const development = require("./webpack.development.js");
const production = require("./webpack.production.js");

const paths = {
  entry: path.resolve(__dirname, "./dist/src/index.js"),
  bundle: path.resolve(__dirname, "dist/browser"),
};

const outputs = (base, env, mapping, overrides) => {
  const collection = [];
  const library = "masa-sdk";
  const windowLibrary = "MasaSDK";

  let environment = development;
  let ext = "js";

  if (env === "production") {
    environment = production;
    ext = `min.${ext}`;
  }

  Object.entries(mapping).forEach(([target, extension]) => {
    const filename = `${library}.${extension}.${ext}`;

    const compiled = {
      output: {
        filename: filename,
        library: target === "window" ? windowLibrary : library,
        libraryTarget: target,
        path: paths.bundle,
      },
    };

    collection.push(merge(base, environment, compiled, overrides));
  });

  return collection;
};

module.exports = {
  outputs,
  paths,
};
