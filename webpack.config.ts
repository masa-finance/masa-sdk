import { Configuration } from "webpack";

import { common } from "./webpack.common";
import { outputs } from "./webpack.parts";

const { NODE_ENV } = process.env;
const isProduction = NODE_ENV === "production";

const outputMappings: Record<string, string> = {
  amd: "amd",
  commonjs: "cjs",
  commonjs2: "cjs2",
  umd: "umd",
  window: "window",
};

const configurationOverrides: Configuration = {};

const configurations: Configuration[] = outputs(
  common,
  isProduction ? "production" : "development",
  outputMappings,
  configurationOverrides,
);

export default configurations;
