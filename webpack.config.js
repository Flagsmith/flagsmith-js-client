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
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    }
};


module.exports = [
    Object.assign({}, defaultConfig, { //compile the example
        output: {
            filename: "index.js",
            library: "bullet-train",
            libraryTarget: "umd",
            path: path.join(__dirname, '/bullet-train-client/lib'),
        },
        entry: {
            main: './index.js'
        }
    }),
    Object.assign({}, defaultConfig, { //compile the example
        output: {
            filename: "bullet-train.js",
            library: "bullet-train",
            libraryTarget: "umd",
            path: path.join(__dirname, '/bullet-train-client/example/src'),
        },
        entry: {
            main: './index.js'
        }
    }),
    Object.assign({}, defaultConfig, { //compile the example
        entry: {
            main: './index.react-native.js'
        },
        externals: {
            'react-native' : 'react-native' // Case matters here
        },
        output: {
            filename: "bullet-train.js",
            library: "bullet-train",
            libraryTarget: "umd",
            path: path.join(__dirname, '/react-native-bullet-train/example'),
        }
    }),
    Object.assign({}, defaultConfig, { //compile the example
        entry: {
            main: './index.react-native.js'
        },
        externals: {
            'react-native' : 'react-native' // Case matters here
        },
        output: {
            filename: "index.js",
            library: "bullet-train",
            libraryTarget: "umd",
            path: path.join(__dirname, '/react-native-bullet-train/lib'),
        }
    }),
];