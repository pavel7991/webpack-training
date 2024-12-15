const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const EslintWebpackPlugin = require('eslint-webpack-plugin')

const IS_DEV = process.env.NODE_ENV === 'development'
const IS_PROD = !IS_DEV


const optimize = () => {
  return {
    splitChunks: {
      chunks: 'all'
    },
    minimizer: [
      new CssMinimizerWebpackPlugin(),
      new TerserPlugin()
    ]
  }
}

const getFilename = (ext) => `[name]${IS_DEV ? '' : '.[contenthash]'}.${ext}`

const setPostCssLoader = () => {
  return {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          require('autoprefixer')({
            overrideBrowserslist: ['last 2 versions', '> 1%'],
          }),
        ],
      },
    },
  }
}

const setCssLoaders = (extra) => {
  const loaders = [
    MiniCssExtractPlugin.loader,
    'css-loader'
  ]

  if (IS_PROD) loaders.push(setPostCssLoader())

  return (extra ? [...loaders, extra] : loaders);
}

const setJsLoaders = (extra) => {
  const loaders = {
    loader: "babel-loader",
    options: {
      presets: ['@babel/preset-env']
    }
  }
  if (extra) loaders.options.presets.push(extra)
  return loaders
}

const setPlugins = () => {
  const plugins = [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.png'),
          to: path.resolve(__dirname, 'dist'),
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: getFilename('css')
    }),
    new EslintWebpackPlugin({
      extensions: ['js'],
      fix: true
    })
  ]

  return plugins
}

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: './index.jsx',
    stat: './statistics.ts'
  },
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: getFilename('js')
  },
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@css': path.resolve(__dirname, 'src/css'),
      '@less': path.resolve(__dirname, 'src/less'),
      '@scss': path.resolve(__dirname, 'src/scss'),
    }
  },
  optimization: optimize(),
  devServer: {
    port: 4200,
    hot: false
  },
  devtool: IS_DEV ? 'source-map' : false,
  plugins: setPlugins(),
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: setJsLoaders()
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: setJsLoaders('@babel/preset-react')
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: setJsLoaders('@babel/preset-typescript')
      },
      {
        test: /\.css$/i,
        use: setCssLoaders()
      },
      {
        test: /\.less$/i,
        use: setCssLoaders('less-loader')
      },
      {
        test: /\.s[ac]ss$/i,
        use: setCssLoaders('sass-loader')
      },
      {
        test: /\.(png|jpe?g|svg|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name].[contenthash][ext]'
        }
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[contenthash][ext]'
        }
      }
    ]
  }
}