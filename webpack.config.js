const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
  mode: 'development',
  devtool: 'source-map', // Don't use eval, it is blocked by CSP
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /.*\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /.*\.png$/,
        use: ['url-loader']
      },
      {
        test: /.*\.js$/,
        use: ['babel-loader']
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.template.html',
      filename: 'index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.webapp' }
      ]
    }),
  ],
};
