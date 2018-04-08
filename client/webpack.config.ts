import * as webpack from "webpack";
import * as path from "path";
import { AureliaPlugin, ModuleDependenciesPlugin } from "aurelia-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

function ensureArray(config) {
  return (config && (Array.isArray(config) ? config : [config])) || [];
}
function when(condition, config, negativeConfig) {
  condition ? ensureArray(config) : ensureArray(negativeConfig);
}

const title = "Conduit";
const outDir = path.resolve(__dirname, "dist");
const srcDir = path.resolve(__dirname, "src");
const nodeModulesDir = path.resolve(__dirname, "node_modules");
const baseUrl = "/";

function config({ production, server }) {
  return {
    mode: production ? "production" : "development",
    resolve: {
      extensions: [".ts", ".js"],
      modules: [srcDir, "node_modules"],
      alias: {
        bluebird: path.join(nodeModulesDir, "bluebird/js/browser/bluebird.core")
      }
    },
    entry: {
      app: ["aurelia-bootstrapper"],
      vendor: ["bluebird"]
    },
    output: {
      path: outDir,
      publicPath: baseUrl,
      filename: production ? "[name].[chunkhash].bundle.js" : "[name].[hash].bundle.js",
      sourceMapFilename: production ? "[name].[chunkhash].bundle.map" : "[name].[hash].bundle.map",
      chunkFilename: production ? "[name].[chunkhash].chunk.js" : "[name].[hash].chunk.js"
    },
    devtool: production ? "nosources-source-map" : "cheap-module-eval-source-map",
    devServer: {
      contentBase: outDir,
      historyApiFallback: true
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [{ loader: "style-loader" }, { loader: "css-loader" }],
          issuer: [{ not: [{ test: /\.html$/i }] }]
        },
        {
          test: /\.css$/i,
          use: [{ loader: "css-loader" }],
          issuer: [{ test: /\.html$/i }]
        },
        {
          test: /\.html$/i,
          use: [{ loader: "html-loader" }]
        },
        {
          test: /\.json$/i,
          use: [{ loader: "json-loader" }]
        },
        {
          test: /\.ts$/i,
          use: [{ loader: "ts-loader" }],
          exclude: nodeModulesDir
        },
        {
          test: /[\/\\]node_modules[\/\\]bluebird[\/\\].+\.js$/,
          use: [{ loader: "expose-loader?Promise" }]
        },
        {
          test: /\.(png|gif|jpg|cur)$/i,
          use: [
            {
              loader: "url-loader",
              options: { limit: 8192 }
            }
          ]
        },
        {
          test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
          use: [
            {
              loader: "url-loader",
              options: { limit: 10000, mimetype: "application/font-woff2" }
            }
          ]
        },
        {
          test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
          use: [
            {
              loader: "url-loader",
              options: { limit: 10000, mimetype: "application/font-woff" }
            }
          ]
        },
        {
          test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
          use: [
            {
              loader: "file-loader"
            }
          ]
        }
      ]
    },
    plugins: [
      new AureliaPlugin(),
      new webpack.ProvidePlugin({
        Promise: "bluebird"
      }),
      new ModuleDependenciesPlugin({
        "aurelia-testing": ["./compile-spy", "./view-spy"]
      }),
      new HtmlWebpackPlugin({
        template: "index.ejs",
        metadata: {
          title,
          server,
          baseUrl
        }
      })
    ]
  };
}

export default config;
