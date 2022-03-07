var path = require("path");

const defaultConfig = {
    entry: './index.ts',
    devtool: 'source-map',
    target:"node",
    mode:"production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
};

const webBundle = Object.assign({}, defaultConfig, { //Bundle 1: compile the web client
    output: {
        libraryTarget:'umd',
        filename: "index.js",
        path: path.join(__dirname, '/flagsmith/'),
        globalObject: 'this',
    },
    entry: {
        main: './index.ts'
    }
});

const isomorphicBundle = Object.assign({}, defaultConfig, { //Bundle 1: compile the web client
    output: {
        libraryTarget:'umd',
        filename: "isomorphic.js",
        path: path.join(__dirname, '/flagsmith'),
        globalObject: 'this',
    },
    entry: {
        main: './isomorphic.ts'
    }
});

const reactNativeBundle = Object.assign({}, defaultConfig, { //Bundle 4: compile the react native client for the example project
    entry: {
        main: './index.react-native.ts'
    },
    externals: {
        'react-native': 'react-native'
    },
    output: {
        filename: "index.js",
        library: "flagsmith",
        libraryTarget: "umd",
        path: path.join(__dirname, '/react-native-flagsmith/lib'),
    }
});
const reactBundle = Object.assign({}, defaultConfig, { //Bundle 4: compile the react native client for the example project
    entry: {
        main: './react/index.ts'
    },
    externals: {
        react: {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react',
            umd: 'react',
        },
        'react-dom': {
            root: 'ReactDOM',
            commonjs2: 'react-dom',
            commonjs: 'react-dom',
            amd: 'react-dom',
            umd: 'react-dom',
        },
    },
    output: {
        filename: "index.js",
        library: "flagsmith",
        libraryTarget: "umd",
        path: path.join(__dirname, '/flagsmith/react'),
    }
});

module.exports = [
    webBundle, reactNativeBundle, isomorphicBundle, reactBundle
    // isomorphicBundle2
];
