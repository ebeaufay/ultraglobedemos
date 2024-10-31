const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const fs = require('fs');

const DEFAULT_WEBPACK_PORT = 3001;
const isDevelopment = process.env.NODE_ENV !== 'production';

const testAppsDir = path.resolve(__dirname, './demos/');

const apps = fs.readdirSync(testAppsDir).filter((file) => {
  return fs.statSync(path.join(testAppsDir, file)).isDirectory();
});

const entry = {};
const htmlPlugins = apps.map((app) => {
  const appDir = path.join(testAppsDir, app);
  const entryFileJs = path.join(appDir, 'src/index.js');
  const entryFileTs = path.join(appDir, 'src/index.ts');
  const entryFileTsx = path.join(appDir, 'src/index.tsx');

  let entryFile;
  if (fs.existsSync(entryFileTsx)) {
    entryFile = entryFileTsx;
  } else if (fs.existsSync(entryFileTs)) {
    entryFile = entryFileTs;
  } else if (fs.existsSync(entryFileJs)) {
    entryFile = entryFileJs;
  } else {
    throw new Error(`No index.js, index.ts, or index.tsx found for app: ${app}`);
  }

  entry[app] = entryFile;

  return new HtmlWebpackPlugin({
    filename: `${app}.html`,
    template: path.join(appDir, 'index.html'),
    chunks: [app],
  });
});

module.exports = {
  mode: isDevelopment ? "development" : "production",
  entry: entry,

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, './dist'),
    clean: true,
  },

  plugins: [
    new webpack.ProgressPlugin(),
    ...htmlPlugins,
    isDevelopment ? new webpack.HotModuleReplacementPlugin() : new MiniCssExtractPlugin({
      filename: "[name].bundle.[hash].css"
    }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
    new webpack.ProvidePlugin({
      'THREE': 'three'
    }),
  ].filter(Boolean),

  devtool: isDevelopment ? "inline-source-map" : "source-map",

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript"
            ],
            plugins: [
              isDevelopment && require.resolve('react-refresh/babel')
            ].filter(Boolean),
          },
        },
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "resolve-url-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.css$/i,
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
        ]
      },
      {
        test: /\.html$/i,
        loader: "html-loader"
      },
      {
        test: /\.(eot|woff|woff2|otf|ttf|svg)$/,
        use: [{
          loader: "file-loader",
          options: {
            name: "fonts/[name].[ext]"
          }
        }]
      },
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader'
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.wasm$/,
        type: "webassembly/async",
      },
    ],
  },
  optimization: {
    minimizer: [new TerserPlugin({
      parallel: true,
      terserOptions: {
        mangle: true,
      },
      exclude: []
    })]
  },
  devServer: {
    hot: true,
    open: true,
    port: DEFAULT_WEBPACK_PORT,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    fallback: {
      "fs": false,
      "path": require.resolve("path-browserify")
    },
  },
  experiments: {
    asyncWebAssembly: true,
  },
};
