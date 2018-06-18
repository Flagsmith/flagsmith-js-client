const path = require('path');
const defaultConfig = {
    mode: "production",
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    }
};

const webBundle = Object.assign({}, defaultConfig, { //Bundle 1: compile the web client
    output: {
        filename: "index.js",
        library: "bullet-train",
        libraryTarget: "umd",
        path: path.join(__dirname, '/bullet-train-client/lib'),
    },
    entry: {
        main: './index.js'
    }
});

const webExampleBundle = Object.assign({}, defaultConfig, {  //Bundle 2: compile the web client for the example project
    output: {
        filename: "bullet-train.js",
        library: "bullet-train",
        libraryTarget: "umd",
        path: path.join(__dirname, '/bullet-train-client/example/src'),
    },
    entry: {
        main: './index.js'
    }
});

const reactNativeBundle = Object.assign({}, defaultConfig, { //Bundle 3: compile the react native client
    entry: {
        main: './index.react-native.js'
    },
    externals: {
        'react-native': 'react-native'
    },
    output: {
        filename: "bullet-train.js",
        library: "bullet-train",
        libraryTarget: "umd",
        path: path.join(__dirname, '/react-native-bullet-train/example'),
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
        path: path.join(__dirname, '/react-native-bullet-train/lib'),
    }
});

module.exports = [
    webBundle, webExampleBundle, reactNativeBundle, reactNativeExampleBundle,
];