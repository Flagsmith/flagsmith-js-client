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
    terser({
        format: {
            comments: false
        },
    }),
];

const pluginsES = (exclude)=>[
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
    terser({
        format: {
            comments: false
        },
    }),
];

const generateES = (config, filePath, _plugins, input) => {
    return {
        ...config,
        input,
        plugins: pluginsES(_plugins),
        output: [
            {
                ...config.output[0],
                file: filePath,
                format: 'es'
            }
        ]
    }
}

const webModule = {
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
}

const webES = generateES(
    webModule,
    path.join(__dirname, '/flagsmith-es/index.js'),
    [
        "./react/**",
        "./isomorphic.ts",
        "./index.react-native.ts",
    ],
    './index-es.ts',
)



const isomorphicModule =  {
    input: './isomorphic.ts',
    output: [
        {
            file: path.join(__dirname, '/flagsmith/isomorphic.js'),
            format: "umd",
            name:"isomorphic",
            sourcemap: true,
        },
    ],
    plugins: plugins(
        [
            "./react/index.ts",
            "./index.react-native.ts",
        ]
    ),
    external: ["react", "react-dom"]
};

const isomorphicES = generateES(
    isomorphicModule,
    path.join(__dirname, '/flagsmith-es/isomorphic.js'),
    [
        "./react/index.ts",
        "./index.react-native.ts",
    ],
    './isomorphic-es.ts',

)

const nextModule =  {
    input: './next-middleware.ts',
    output: [
        {
            file: path.join(__dirname, '/flagsmith/next-middleware.js'),
            format: "umd",
            name:"next-middleware",
            sourcemap: true,
        },
    ],
    plugins: plugins(
        [
            "./react/index.ts",
            "./index.react-native.ts",
        ]
    ),
    external: ["react", "react-dom"]
};

const nextES = generateES(
    nextModule,
    path.join(__dirname, '/flagsmith-es/next.js'),
    [
        "./react/index.ts",
        "./index.react-native.ts",
    ],
    './next-middleware.ts',

)

const reactModule =     {
    input: './react/index.tsx',
    output: [
        {
            file: path.join(__dirname, '/flagsmith/react/index.js'),
            format: "umd",
            name:"flagsmith/react",
            sourcemap: true,
        },
    ],
    plugins: plugins(
        [
            "./index.ts",
            "./types.ts",
            "./isomorphic.ts",
            "./index.react-native.ts",
        ]
    ),
    external: ["react", "react-dom"]
}

const reactModuleES = generateES(
    reactModule,
    path.join(__dirname, '/flagsmith-es/react/index.js'),
    [
        "./index.ts",
        "./types.ts",
        "./isomorphic.ts",
        "./index.react-native.ts",
    ],
    reactModule.input
)


export default [webModule, isomorphicModule,isomorphicES, nextModule, nextES, webES, reactModule, reactModuleES].concat([
    {
        input: './index.react-native.ts',
        output: [
            {
                file: path.join(__dirname, '/react-native-flagsmith/index.js'),
                format: "umd",
                name:"react-native-flagsmith",
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
        external: ["react", "react-dom", "react-native"]
    },
])
