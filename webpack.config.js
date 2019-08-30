const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const loadersConf       = require("./webpack.loaders")
const path              = require("path")
const webpack           = require("webpack")

module.exports = {
    node: {
        fs: "empty",
        net: "empty",
        tls: "empty",
        dns: "empty"
    },
    entry: [
        "core-js/fn/promise",
        "core-js/es6/object",
        "core-js/es6/array",
        "./src/index.jsx" // entry point
    ],
    devtool: process.env.WEBPACK_DEVTOOL || "eval-source-map",
    output: {
        publicPath: "/",
        path: path.join(__dirname, "public"),
        filename: "bundle.js"
    },
    module: {
        rules: loadersConf
    },
    resolve: {
        extensions: [".js", ".jsx"],
        modules: [
            path.join(__dirname, "src"),
            path.join(__dirname, "node_modules")
        ],
        alias: {
            styles: path.resolve(__dirname, "styles/")
        }
    },
    devServer: {
        contentBase: "./public"
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
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
