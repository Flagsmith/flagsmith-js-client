import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import path from 'path';

const externalDependencies = ["react", "react-dom", "react-native"];

// Reuse the same plugin setup as production, but without terser
const createPlugins = (exclude) => [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ 
        tsconfig: "./tsconfig.json", 
        exclude,
        compilerOptions: {
            removeComments: false,
            preserveConstEnums: true,
            sourceMap: true
        }
    }),
    // Note: No terser plugin here for non-minified output
];

const sourcemapPathTransform = (relativeSourcePath) => {
    if(relativeSourcePath.includes("node_modules")) {
        return relativeSourcePath
    }
    return relativeSourcePath.replace("../../../", "./src/");
}

// Reuse the same config structure as production, but with debug-friendly output options
const generateConfig = (input, outputDir, name, exclude = []) => ({
    input,
    output: [
        { 
            file: path.join(outputDir, `${name}.js`), 
            format: "umd", 
            name, 
            sourcemap: true,
            sourcemapPathTransform,
            indent: true,
            compact: false,
            minifyInternalExports: false
        },
        { 
            file: path.join(outputDir, `${name}.mjs`), 
            format: "es", 
            sourcemap: true, 
            sourcemapPathTransform,
            indent: true,
            compact: false,
            minifyInternalExports: false
        },
    ],
    plugins: createPlugins(exclude),
    external: externalDependencies,
});

// Reuse the exact same build targets as production
export default [
    generateConfig('./index.ts', './lib/flagsmith', 'index', ['./react.tsx', './isomorphic.ts', './index.react-native.ts']),
    generateConfig('./isomorphic.ts', './lib/flagsmith', 'isomorphic', ['./react/index.ts', './index.react-native.ts']),
    generateConfig('./next-middleware.ts', './lib/flagsmith', 'next-middleware', ['./react.tsx', './index.react-native.ts']),
    generateConfig('./react.tsx', './lib/flagsmith', 'react', ['./index.ts', './types.ts', './isomorphic.ts', './index.react-native.ts']),
    generateConfig('./react.tsx', './lib/react-native-flagsmith', 'react', ['./index.ts', './types.ts', './isomorphic.ts', './index.react-native.ts']),
    generateConfig('./index.react-native.ts', './lib/react-native-flagsmith', 'index', ['./react/**', './isomorphic.ts', './index.react-native.ts']),
]; 