"use strict";

const { paths } = require("./webpack.parts.js");

module.exports = {
  entry: paths.entry,
  mode: "none",
  optimization: {
    minimize: true,
    emitOnErrors: false,
  },
  resolve: {
    extensions: [".js"],
    modules: ["node_modules"],
    fallback: {
      os: false,
      crypto: false,
      url: false,
      https: false,
      http: false,
      assert: false,
      path: false,
      stream: false,
      zlib: false,
      fs: false,
    },
  },
};
