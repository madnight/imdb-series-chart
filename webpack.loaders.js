const path = require("path");
const ExtractTextPlugin    = require("extract-text-webpack-plugin")

const sassIncludePaths = [path.resolve(__dirname, "styles")];

const sassResourcesPaths = [
    path.resolve(__dirname, "styles/abstracts/_variables.sass"),
    path.resolve(__dirname, "styles/abstracts/_mixins.sass")
];

module.exports = [
    {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, "src"),
        loader: "babel-loader",
        options: {
            cacheDirectory: true,
            plugins: ["react-hot-loader/babel"],
            presets: ["react", "stage-2"]
        }
    },
    {
        // Fonts
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        exclude: path.resolve(__dirname, "node_modules"),
        use: ["file-loader"]
    },
    {
        test: /\.(woff|woff2)$/,
        exclude: path.resolve(__dirname, "node_modules"),
        use: [
            {
                loader: "url-loader",
                options: { prefix: "font", limit: 5000 }
            }
        ]
    },
    {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        exclude: path.resolve(__dirname, "node_modules"),
        use: [
            {
                loader: "url-loader",
                options: {
                    prefix: "font",
                    limit: 10000,
                    mimetype: "application/octet-stream"
                }
            }
        ]
    },
    {
        // Images
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        exclude: path.resolve(__dirname, "node_modules"),
        use: [
            {
                loader: "url-loader",
                options: {
                    limit: 10000,
                    mimetype: "image/svg+xml"
                }
            }
        ]
    },
    {
        test: /\.gif/,
        exclude: path.resolve(__dirname, "node_modules"),
        use: [
            {
                loader: "url-loader",
                options: {
                    limit: 10000,
                    mimetype: "image/gif"
                }
            }
        ]
    },
    {
        test: /\.jpg/,
        exclude: path.resolve(__dirname, "node_modules"),
        use: [
            {
                loader: "url-loader",
                options: {
                    limit: 10000,
                    mimetype: "image/jpg"
                }
            }
        ]
    },
    {
        test: /\.png/,
        exclude: path.resolve(__dirname, "node_modules"),
        use: [
            {
                loader: "url-loader",
                options: {
                    limit: 10000,
                    mimetype: "image/png",
                    name: "[path][name].[ext]"
                }
            }
        ]
    },
    {
        // Global CSS (from node_modules)
        test: /\.css/,
        include: path.resolve(__dirname, "node_modules"),
        use: [
            {
                loader: "style-loader"
            },
            {
                loader: "css-loader"
            }
        ]
    },
    {
        // Global CSS (from node_modules)
        test: /\.css/,
        include: path.resolve(__dirname, "src"),
        use: [
            {
                loader: "style-loader"
            },
            {
                loader: "css-loader"
            }
        ]
    },
    {
        // Global SASS (from app)
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, "styles/base"),
        use: [
            {
                loader: "style-loader"
            },
            {
                loader: "css-loader"
            },
            {
                loader: "sass-loader"
            }
        ]
    },
    {
        // Local SASS css-modules
        test: /\.(sass|scss)$/,
        exclude: path.resolve(__dirname, "styles/base"),
        use: [
            {
                loader: "style-loader"
            },
            {
                loader: "css-loader"
            },
            {
                loader: "sass-loader"
            }
        ]
    }
];
