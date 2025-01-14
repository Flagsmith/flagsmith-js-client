import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import path from 'path';

const externalDependencies = ["react", "react-dom", "react-native"];

const createPlugins = (exclude) => [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json", exclude }),
    terser({
        format: {
            comments: false,
        },
    }),
];
const sourcemapPathTransform = (relativeSourcePath) => {
    if(relativeSourcePath.includes("node_modules")) {
        return relativeSourcePath
    }
    return relativeSourcePath.replace("../../../", "./src/");
}

const generateConfig = (input, outputDir, name, exclude = []) => ({
    input,
    output: [
        { file: path.join(outputDir, `${name}.js`), format: "umd", name, sourcemap: true,sourcemapPathTransform },
        { file: path.join(outputDir, `${name}.es.js`), format: "es", sourcemap: true, sourcemapPathTransform },
    ],
    plugins: createPlugins(exclude),
    external: externalDependencies,
});

export default [
    generateConfig('./index.ts', './lib/flagsmith', 'index', ['./react.tsx', './isomorphic.ts', './index.react-native.ts']),
    generateConfig('./isomorphic.ts', './lib/flagsmith', 'isomorphic', ['./react/index.ts', './index.react-native.ts']),
    generateConfig('./next-middleware.ts', './lib/flagsmith', 'next-middleware', ['./react.tsx', './index.react-native.ts']),
    generateConfig('./react.tsx', './lib/flagsmith', 'react', ['./index.ts', './types.ts', './isomorphic.ts', './index.react-native.ts']),
    generateConfig('./react.tsx', './lib/react-native-flagsmith', 'react', ['./index.ts', './types.ts', './isomorphic.ts', './index.react-native.ts']),
    generateConfig('./index.react-native.ts', './lib/react-native-flagsmith', 'index', ['./react/**', './isomorphic.ts', './index.react-native.ts']),
];
