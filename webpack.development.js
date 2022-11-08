"use strict";

const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  devtool: "inline-source-map",
  optimization: {
    minimizer: [
      new TerserPlugin({
        test: /vendor/,
        terserOptions: {
          sourceMap: false,
        },
      }),
      new TerserPlugin({
        test: /^((?!(vendor)).)*.js$/,
        terserOptions: {
          sourceMap: true,
        },
      }),
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
};
