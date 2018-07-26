'use strict';
const path = require('path');
const distDir = path.resolve(__dirname, 'dist');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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
    },{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader',
      }),
    },{
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000',
    }]
  },
  devServer: {
    contentBase: distDir,
    port: 60800,
    proxy: {
      '/api': 'http://127.0.0.1:60702',
      '/es': {
        target: 'http://127.0.0.1:9200',
        pathRewrite: {'^/es' : ''},
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
    new ExtractTextPlugin('styles.css'),
  ],
};
