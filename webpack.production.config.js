const ExtractTextPlugin    = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin    = require("html-webpack-plugin")
const WebpackCleanupPlugin = require("webpack-cleanup-plugin")
const loaders              = require("./webpack.loaders")
const path                 = require("path")
const webpack              = require("webpack")

module.exports = {
    node: {
        fs: "empty",
        net: "empty",
        tls: "empty",
        dns: "empty"
    },

    entry: ["./src/index.jsx"],
    output: {
        publicPath: "./",
        path: path.join(__dirname, "public"),
        filename: "[chunkhash].js"
    },
    resolve: {
        extensions: [".js", ".jsx"],
        alias: {
            styles: path.resolve(__dirname, "styles/")
        }
    },
    module: {
        rules: loaders
    },
    plugins: [
        new WebpackCleanupPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new ExtractTextPlugin({
            filename: "style.css",
            allChunks: true
        }),
        new HtmlWebpackPlugin({
            template: "./src/template.html",
            files: {
                css: ["style.css"],
                js: ["bundle.js"]
            }
        })
    ]
};
