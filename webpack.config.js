var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    cache: true,
    entry: {
        index: './script/index.tsx',
        vendor: ['react', 'react-dom']
    },
    output: {
        path: path.resolve('src/main/webapp/static'),
        filename: 'index.js',//[name]
        chunkFilename: "[name].js",
        publicPath: "/static/"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    externals: {},
    module: {
        loaders: [
            {test: /\.tsx?$/, loader: "ts-loader"},
            {test: /\.less$/, loader: ExtractTextPlugin.extract({fallback: "style-loader", use: "css-loader!less-loader"})},
            {test: /\.scss$/, loader: ExtractTextPlugin.extract({fallback: "style-loader", use: "css-loader!sass-loader"})},
            {test: /\.css$/, loader: ExtractTextPlugin.extract({fallback: "style-loader", use: "css-loader"})},
            {test: /\.jpg$/, loader: 'url-loader?limit=100000'},
            {test: /\.png/, loader: 'url-loader?limit=100000&mimetype=image/png'},
            {test: /\.gif/, loader: 'url-loader?limit=100000&mimetype=image/gif'},
            {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff"},
            {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff"},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream"},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader"},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml"}
        ],
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.min.js',
        }),
        new ExtractTextPlugin({
            filename: 'build.min.css',
            allChunks: true,
        }),
    ]
};