import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import path from "path";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace  from '@rollup/plugin-replace';
import * as react from 'react';
import * as reactDom from 'react-dom';

const packageJson = require("./package.json");
const plugins = (exclude)=>[
    peerDepsExternal(),
    nodeResolve(),
    resolve(),
    commonjs({
        namedExports: {
            react: Object.keys(react),
            'react-dom': Object.keys(reactDom)
        }
    }),
    typescript({ tsconfig: "./tsconfig.json",exclude }),
    // terser(),
    // replace({
    //     'Object.defineProperty(exports,"__esModule",{value:!0});': '',
    // }),
];
export default [
    {
        input: './index.ts',
        output: [
            {
                file: path.join(__dirname, '/flagsmith/index.js'),
                format: "umd",
                name:"flagsmith",
                sourcemap: true,
            },
        ],
        plugins: plugins(
            [
                "./react/**",
                "./isomorphic.ts",
                "./index.react-native.ts",
            ]
        ),
        external: ["react", "react-dom"]
    },
    {
        input: './react/index.tsx',
        output: [
            {
                file: path.join(__dirname, '/flagsmith/react/index.js'),
                format: "umd",
                name:"flagsmith/react",
                sourcemap: true,
            },
        ],
        plugins: plugins(),
        external: ["react", "react-dom"]
    },
];
