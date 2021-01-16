// @ts-nocheck
import Path from "path";
import shebang from "rollup-plugin-preserve-shebang";
import autoExternal from "rollup-plugin-auto-external";
import json from "@rollup/plugin-json";
import globals from "rollup-plugin-node-globals";
import builtins from "rollup-plugin-node-builtins";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import ts from "@wessberg/rollup-plugin-ts";

const input = {
  configs: "scripts/configs/index.ts",
  index: "scripts/cli/index.ts",
};

const external = [Path.resolve(__dirname, "./package.json")];

const extensions = [
  ".js",
  ".jsx",
  ".es6",
  ".es",
  ".mjs",
  ".ts",
  ".tsx",
  ".vue",
  ".json",
];

const chunkFileNames = "[name].js";

const dir = "src";

const entryFileNames = "[name].js";

const format = "cjs";

const freeze = false;

const hoistTransitiveImports = false;

const preferConst = true;

const minifyInternalExports = false;

const preserveEntrySignatures = "strict";

const treeshake = {
  annotations: true,
  moduleSideEffects: true,
  propertyReadSideEffects: true,
  tryCatchDeoptimization: true,
  unknownGlobalSideEffects: true,
};

const watch = {
  include: "scripts/**/*",
};

const Entries = Object.keys(input);

const IdPathParser = (id) =>
  id
    .replace(__dirname, "")
    .split(Path.sep)
    .filter((s) => s && s.length > 0)
    .join("/");

const GetEntryName = (id) => Entries.find((k) => input[k] === IdPathParser(id));

const manualChunks = (id, { getModuleInfo }) => {
  const mod = getModuleInfo(id);

  if (mod.isEntry) return GetEntryName(id);

  const { importers } = mod;

  if (importers.length > 0) {
    const entry = importers.find((v) => getModuleInfo(v).isEntry);
    if (entry) return GetEntryName(entry);
  }
};

const output = {
  chunkFileNames,
  dir,
  entryFileNames,
  format,
  freeze,
  hoistTransitiveImports,
  preferConst,
  minifyInternalExports,
  manualChunks,
  esModule: false,
  exports: "named",
};

const customResolver = nodeResolve({ extensions });

const plugins = [
  json(),
  autoExternal(),
  shebang({
    shebang: "#!/usr/bin/env node",
    entry: Path.resolve(process.cwd(), "scripts/cli/index.ts"),
  }),
  globals(),
  builtins(),
  customResolver,
  alias({ customResolver }),
  commonjs(),
  ts({
    browserslist: false,
  }),
];

export default {
  input,
  external,
  output,
  preserveEntrySignatures,
  treeshake,
  watch,
  plugins,
};
