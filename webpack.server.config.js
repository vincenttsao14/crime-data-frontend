/* eslint-disable comma-dangle, no-var, quote-props, vars-on-top */

var fs = require('fs')
var path = require('path')

var webpack = require('webpack')

var nodeModules = {}

fs
  .readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach(mod => {
    nodeModules[mod] = `commonjs ${mod}`
  })

var config = {
  cache: false,
  entry: './src/server.js',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'server.js'
  },
  target: 'node',
  node: {
    __dirname: false
  },
  externals: nodeModules,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!autotrack|dom-utils)/,
        loader: 'babel-loader'
      },
      {
        test: /\.ya*ml$/,
        use: ['json-loader', 'yaml-loader']
      }
    ]
  },
  plugins: [new webpack.IgnorePlugin(/\.(css|less)$/)]
}

module.exports = config
