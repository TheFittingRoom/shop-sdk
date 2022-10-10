import typescript from '@rollup/plugin-typescript';
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import dotenv from "rollup-plugin-dotenv"
import pkg from "./package.json";

const banner = `/*!
* thefittingroom v${pkg.version} (${new Date().toISOString()})
* Copyright 2022-present, TheFittingRoom, Inc. All rights reserved.
*/`;

const browserConfig = {
    format: "iife",
    name: "thefittingroom",
    banner,
};


const tsconfigOverride = {
    exclude: ["node_modules", "**/*.test.ts"],
};
export default {
    input: 'src/index.ts',
    output: [
        {
            file: `dist/esm/main.js`,
            format: "esm",
            banner,
        },
        {
            file: `dist/esm/main.min.js`,
            format: "esm",
            banner,
            plugins: [terser()],
        },
        {
            file: `dist/cjs/main.js`,
            format: "cjs",
            banner,
            // plugins: [commonjs()],
        },
        {
            file: `dist/cjs/main.min.js`,
            format: "cjs",
            banner,
            plugins: [terser()],
        },
        {
            file: `dist/iife/main.js`,
            ...browserConfig,
        },
        {
            file: `dist/iife/main.min.js`,
            ...browserConfig,
            plugins: [terser()],
        },
    ],
    plugins: [ dotenv(),nodeResolve(),typescript({ ...tsconfigOverride })]
};