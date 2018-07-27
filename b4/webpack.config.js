/***
 * Excerpted from "Node.js 8 the Right Way",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/jwnode2 for more book information.
***/
'use strict';
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './app/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'ts-loader',
    },{
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },{
      test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      loader: 'url-loader?limit=100000',
    }]
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
