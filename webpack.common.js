const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const cloneDeep = require('lodash/cloneDeep')
const fs = require('fs')
const yaml = require('js-yaml')
const path = require('path')
const handlebars = require('handlebars')
const showdown = require('showdown')
const md = new showdown.Converter()


function formatStrings(data, isMarkdown=false) {
  let parsedData = cloneDeep(data)

  if (Array.isArray(data)) {
    parsedData = data.map(formatStrings)
  }
  else if (typeof(data) === 'object') {
    for (let key of Object.keys(data)) {
      if (data[key]) {
        parsedData[key] = formatStrings(data[key], key.match(/_html$/))
      }
    }
  }
  else if (isMarkdown) {
    parsedData = md.makeHtml(data)
  }

  return parsedData
}

function loadStrings(languageCode) {
  const stringsFile = path.resolve(__dirname, 'src', 'translations', `${languageCode}.yml`)
  const strings = yaml.safeLoad(fs.readFileSync(stringsFile, 'utf8'))
  return formatStrings(strings)
}

function HandlebarsPlugin(options) {
  options = options || {};
  this.template = options.template;
}

HandlebarsPlugin.prototype.apply = function(compiler) {
  compiler.hooks.compilation.tap('HandlebarsPlugin', function (compilation) {
    compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync('HandlebarsPlugin', function (data, callback) {
      const template = handlebars.compile(data.html)
      const strings = loadStrings(data.plugin.options.language)
      data.html = template(strings)
      callback(null, data)
    });
  });
}


module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'app.[hash].js',
    path: path.resolve(__dirname, './dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          /node_modules/
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
      }, {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: __dirname + '/postcss.config.js'
              }
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ]
      }, {
        test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      inlineSource: '.(js|css)$',
      language: 'en'
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      inlineSource: '.(js|css)$',
      language: 'es',
      filename: 'index-es.html'
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      inlineSource: '.(js|css)$',
      language: 'de',
      filename: 'index-de.html'
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      inlineSource: '.(js|css)$',
      language: 'cs',
      filename: 'index-cs.html'
    }),
    new CopyPlugin([
      { from: 'static', to: '' }
    ]),
    new MiniCssExtractPlugin({
      filename: 'app.[hash].css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
    new HandlebarsPlugin(),
  ]
};
