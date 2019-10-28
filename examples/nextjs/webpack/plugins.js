const webpack = require('webpack');

const props = {
};

module.exports = [

    new webpack.DefinePlugin(props),

    // Fixes warning in moment-with-locales.min.js
    // Module not found: Error: Can't resolve './locale' in ...
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment\/min$/),

];
