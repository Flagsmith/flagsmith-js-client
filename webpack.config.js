var path = require("path");

const defaultConfig = {
    entry: './index.js',
    mode: "production",
    devtool: 'source-map',
    target: "node",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
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
        path: path.join(__dirname, '/bullet-train-client/lib'),
        globalObject: 'this',
    },
    entry: {
        main: './index.js'
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
        path: path.join(__dirname, '/react-native-bullet-train/lib'),
    }
});

module.exports = [
    webBundle, reactNativeBundle
];
