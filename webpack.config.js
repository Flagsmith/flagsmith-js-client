var path = require("path");

const defaultConfig = {
    entry: './index.ts',
    devtool: 'inline-source-map',
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
        filename: "index.js",
        path: path.join(__dirname, '/flagsmith/isomorphic'),
        globalObject: 'this',
    },
    entry: {
        main: './isomorphic/index.ts'
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

module.exports = [
    webBundle, reactNativeBundle, isomorphicBundle
    // isomorphicBundle2
];
