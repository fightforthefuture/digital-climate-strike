const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new HtmlWebpackInlineSourcePlugin()
  ]
})
