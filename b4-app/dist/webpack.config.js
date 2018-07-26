'use strict';
var path = require('path');
var distDir = path.resolve(__dirname, 'dist');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
module.exports = {
    entry: './app/index.ts',
    output: {
        filename: 'bundle.js',
        path: distDir,
    },
    module: {
        rules: [{
                test: /\.ts$/,
                loader: 'ts-loader',
            }, {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }, {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000',
            }]
    },
    devServer: {
        contentBase: distDir,
        port: 60800,
        proxy: {
            '/api': 'http://localhost:60702',
            '/es': {
                target: 'http://localhost:9200',
                pathRewrite: { '^/es': '' },
            },
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Better Book Bundle Builder',
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
    ],
};
//# sourceMappingURL=webpack.config.js.map