import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";
import json from "@rollup/plugin-json";
import Path from "path";
import resolve from "@rollup/plugin-node-resolve";
import typescript2 from "rollup-plugin-typescript2";
import { main, module, typings } from "./package.json";

const extensions = [
  ".mjs",
  ".js",
  ".jsx",
  ".json",
  ".sass",
  ".scss",
  ".ts",
  ".tsx",
];

const customResolver = resolve({
  extensions,
});

const Outputs = {
  preferConst: true,
  interop: "auto",
  exports: "named",
  freeze: false,
  namespaceToStringTag: true,
};

const GetAbPath = (p) => Path.resolve(__dirname, p);

export default [
  {
    input: GetAbPath("./src/index.ts"),
    output: [
      {
        file: GetAbPath(main),
        format: "cjs",
        ...Outputs,
      },
      {
        file: GetAbPath(module),
        format: "esm",
        ...Outputs,
      },
    ],
    preserveEntrySignatures: "allow-extension",
    external: [],
    treeshake: {
      moduleSideEffects: false,
    },
    watch: { include: "scripts/**" },
    plugins: [
      json(),
      alias({
        customResolver,
      }),
      resolve({ extensions }),
      typescript2({
        tsconfig: GetAbPath("./tsconfig.json"),
        useTsconfigDeclarationDir: true,
      }),
      commonjs({
        extensions,
      }),
    ],
  },
  {
    input: GetAbPath("./types/index.d.ts"),
    output: {
      file: GetAbPath(typings),
      format: "esm",
    },
    watch: { include: "types/**" },
    plugins: [dts()],
  },
];
