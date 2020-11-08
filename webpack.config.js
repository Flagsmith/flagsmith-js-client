var path = require("path");

const defaultConfig = {
    entry: './index.js',
    mode: "production",
    target: "node",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules\/(?!.)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};

const webBundle = Object.assign({}, defaultConfig, { //Bundle 1: compile the web client
    output: {
        libraryTarget:'umd',
        filename: "index.js",
        path: path.join(__dirname, '/flagsmith/'),
        globalObject: 'this',
    },
    entry: {
        main: './index.js'
    }
});

const isomorphicBundle = Object.assign({}, defaultConfig, { //Bundle 1: compile the web client
    output: {
        libraryTarget:'umd',
        filename: "isomorphic-es6.js",
        path: path.join(__dirname, '/flagsmith/'),
        globalObject: 'this',
    },
    entry: {
        main: './isomorphic.js'
    }
});

const reactNativeBundle = Object.assign({}, defaultConfig, { //Bundle 4: compile the react native client for the example project
    entry: {
        main: './index.react-native.js'
    },
    externals: {
        'react-native': 'react-native'
    },
    output: {
        filename: "index.js",
        library: "bullet-train",
        libraryTarget: "umd",
        path: path.join(__dirname, '/react-native-flagsmith/lib'),
    }
});

const reactNativeExampleBundle = Object.assign({}, defaultConfig, { //Bundle 4: compile the react native client for the example project
    entry: {
        main: './index.react-native.js'
    },
    externals: {
        'react-native': 'react-native'
    },
    output: {
        filename: "index.js",
        library: "bullet-train",
        libraryTarget: "umd",
        path: path.join(__dirname, '/examples/react-native/react-native-flagsmith'),
    }
});

module.exports = [
    webBundle, reactNativeBundle, isomorphicBundle,reactNativeExampleBundle
    // isomorphicBundle2
];
