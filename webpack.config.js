const path = require('path');

module.exports = {
    mode: "production",
    entry: "./src/ships.js",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "build.js"
    },

    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
}