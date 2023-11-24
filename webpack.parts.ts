import * as path from "path";
import { Configuration } from "webpack";
import { merge } from "webpack-merge";

import { development } from "./webpack.development";
import { production } from "./webpack.production";

export const paths: { [index: string]: string } = {
  entry: path.resolve(__dirname, "./dist/src/index.js"),
  bundle: path.resolve(__dirname, "./dist/browser"),
};

export const outputs = (
  base: Configuration,
  environment: string,
  mappings: { [index: string]: string },
  overrides: Configuration,
): Configuration[] => {
  const configurations: Configuration[] = [];

  const library: string = "masa-sdk";
  const windowLibrary: string = "MasaSDK";

  let configuration = development;
  let ext = "js";

  if (environment === "production") {
    configuration = production;
    ext = `min.${ext}`;
  }

  for (const [target, extension] of Object.entries(mappings)) {
    const filename = `${library}.${extension}.${ext}`;

    const compiled: Configuration = {
      output: {
        filename,
        library: target === "window" ? windowLibrary : library,
        libraryTarget: target,
        path: paths.bundle,
      },
    };

    configurations.push(merge(base, configuration, compiled, overrides));
  }

  return configurations;
};
