import { Configuration } from "webpack";

import { common } from "./webpack.common";
import { outputs } from "./webpack.parts";

const { NODE_ENV } = process.env;
const isProduction = NODE_ENV === "production";

const outputMappings: { [index: string]: string } = {
  amd: "amd",
  commonjs: "cjs",
  commonjs2: "cjs2",
  umd: "umd",
  window: "window",
};

const configurationOverrides: Configuration = {};

let configuration: Configuration[];

if (isProduction) {
  configuration = outputs(
    common,
    "production",
    outputMappings,
    configurationOverrides,
  );
} else {
  configuration = outputs(
    common,
    "development",
    outputMappings,
    configurationOverrides,
  );
}

export default configuration;
