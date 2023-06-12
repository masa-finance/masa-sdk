"use strict";

const { paths } = require("./webpack.parts.js");
const CircularDependencyPlugin = require("circular-dependency-plugin");

module.exports = {
  entry: paths.entry,
  mode: "none",
  optimization: {
    minimize: true,
    emitOnErrors: false,
  },
  plugins: [
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // include specific files based on a RegExp
      include: /src/,
      // add errors to webpack instead of warnings
      failOnError: false,
      // allow import cycles that include an asyncronous import,
      // e.g. via import(/* webpackMode: "weak" */ './file.js')
      allowAsyncCycles: false,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    }),
  ],
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
