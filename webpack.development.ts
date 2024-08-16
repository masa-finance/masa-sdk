import TerserPlugin from "terser-webpack-plugin";
import { Configuration } from "webpack";

export const development: Configuration = {
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
