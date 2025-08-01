import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

import * as dotenv from 'dotenv'

import pkg from './package.json' with { type: 'json' }

dotenv.config()

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
    // Replace process.env variables with their actual values
    replace({
      preventAssignment: true,
      values: {
        'process.env.DEV_FIREBASE_API_KEY': JSON.stringify(process.env.DEV_FIREBASE_API_KEY),
        'process.env.DEV_FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.DEV_FIREBASE_AUTH_DOMAIN),
        'process.env.DEV_FIREBASE_PROJECT_ID': JSON.stringify(process.env.DEV_FIREBASE_PROJECT_ID),
        'process.env.DEV_FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.DEV_FIREBASE_STORAGE_BUCKET),
        'process.env.DEV_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.DEV_FIREBASE_MESSAGING_SENDER_ID),
        'process.env.DEV_FIREBASE_APP_ID': JSON.stringify(process.env.DEV_FIREBASE_APP_ID),
        'process.env.DEV_API_ENDPOINT': JSON.stringify(process.env.DEV_API_ENDPOINT),
        'process.env.DEV_AVATAR_TIMEOUT_MS': JSON.stringify(process.env.DEV_AVATAR_TIMEOUT_MS),
        'process.env.DEV_VTO_TIMEOUT_MS': JSON.stringify(process.env.DEV_VTO_TIMEOUT_MS),
        'process.env.PROD_FIREBASE_API_KEY': JSON.stringify(process.env.PROD_FIREBASE_API_KEY),
        'process.env.PROD_FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.PROD_FIREBASE_AUTH_DOMAIN),
        'process.env.PROD_FIREBASE_PROJECT_ID': JSON.stringify(process.env.PROD_FIREBASE_PROJECT_ID),
        'process.env.PROD_FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.PROD_FIREBASE_STORAGE_BUCKET),
        'process.env.PROD_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.PROD_FIREBASE_MESSAGING_SENDER_ID),
        'process.env.PROD_FIREBASE_APP_ID': JSON.stringify(process.env.PROD_FIREBASE_APP_ID),
        'process.env.PROD_API_ENDPOINT': JSON.stringify(process.env.PROD_API_ENDPOINT),
        'process.env.PROD_AVATAR_TIMEOUT_MS': JSON.stringify(process.env.PROD_AVATAR_TIMEOUT_MS),
        'process.env.PROD_VTO_TIMEOUT_MS': JSON.stringify(process.env.PROD_VTO_TIMEOUT_MS),
      },
    }),
    nodeResolve(),
    typescript({
      outputToFilesystem: true,
    }),
  ],
}
