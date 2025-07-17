import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import * as dotenv from 'dotenv'

import pkg from './package.json' with { type: 'json' }

const banner = `/*!
* thefittingroom v${pkg.version} (${new Date().toISOString()})
* Copyright 2022-present, TheFittingRoom, Inc. All rights reserved.
*/`

export default {
  input: 'src/index.ts',
  output: [
    {
      file: `dist/esm/index.js`,
      format: 'esm',
      sourcemap: true,
      banner,
    },
    {
      file: `dist/esm/index.min.js`,
      format: 'esm',
      sourcemap: true,
      banner,
      plugins: [terser()],
    },
  ],
  plugins: [
    // Load environment variables using the already installed dotenv package
    {
      name: 'dotenv',
      buildStart() {
        dotenv.config()
      }
    },
    nodeResolve(),
    typescript({
      outputToFilesystem: true
    }),
  ],
}
