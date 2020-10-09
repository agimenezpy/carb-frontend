'esversion: 6';
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const path = require("path");

module.exports = (env, options) => {
  return {
    entry: {
      index: ["./src/assets/scss/style.scss", "./src/app/main.ts"]
    },
    output: {
      filename: "js/[name].[chunkhash].js",
      publicPath: ""
    },
    devServer: {
      proxy: {
        '/api': (options.mode !== 'productiond') ? 'http://127.0.0.1:8081/' : 'http://gis.mic.gov.py/'
      }
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: false,
          terserOptions: {
            output: {
              comments: false
            }
          }
        })
      ]
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          options: {
            transpileOnly: true
          }
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: { minimize: false }
            }
          ],
          exclude: /node_modules/
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            "css-loader",
            {
              loader: "resolve-url-loader",
              options: { includeRoot: true }
            },
            "sass-loader?sourceMap"
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'fonts/'
              }
            }
          ]
        },
        {
          test: /\.(png|jpg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'img/'
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),

        new HtmlWebPackPlugin({
        title: "ArcGIS Template Application",
        template: "./src/index.html",
        filename: "./index.html",
        chunksSortMode: "none",
        inlineSource: ".(css)$"
      }),

      new MiniCssExtractPlugin({
        filename: "[name].[chunkhash].css",
        chunkFilename: "[id].css",
      })
    ],
    resolve: {
      modules: [
        path.resolve(__dirname, "/src"),
        path.resolve(__dirname, "node_modules/")
      ],
      extensions: [".ts", ".tsx", ".js", ".scss", ".css"],
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    node: {
      process: false,
      global: false,
      fs: "empty"
    }
  }
};
