const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const fs = require('fs');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyPlugin = require('copy-webpack-plugin');

const DEFAULT_WEBPACK_PORT = 3001;
const isDevelopment = false;

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
    //clean: true,
    publicPath: './'
  },

  plugins: [
    new webpack.ProgressPlugin(),
    //new BundleAnalyzerPlugin(),
    ...htmlPlugins,
    isDevelopment ? new webpack.HotModuleReplacementPlugin() : new MiniCssExtractPlugin({
      filename: "[name].bundle.[hash].css"
    }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
    /* new webpack.ProvidePlugin({
      'THREE': 'three'
    }), */
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'node_modules/@jdultra/ultra-globe/dist/assets'), // Adjust the path based on your library's asset location
          to: 'assets', // Destination folder in the demo's dist
        },
        // Add other asset directories if needed
      ],
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
          loader: "asset/resource",
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
        test: /\.(png|svg|jpg|jpeg|gif|bin)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8 KB
          },
        },
        generator: {
          filename: 'assets/[hash][ext][query]',
        },
      },
      {
        test: /\.(glb|gltf|obj)$/i,
        type: 'asset',
        generator: {
          filename: 'assets/[hash][ext][query]',
        },
      },
      {
        test: /\.wasm$/,
        type: "webassembly/async",
      },
    ],
  },
  optimization: {
    concatenateModules: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // Extract the package name from the module path
            
            return `vendor`;
          },
          priority: -10,
          reuseExistingChunk: true,
        },
        common: {
          name: 'common',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    minimize: true,
    minimizer: [new TerserPlugin({
      parallel: true,
      terserOptions: {
        ecma: undefined,
        parse: {},
        compress: {
          drop_console: true, // Remove console statements
        },
        mangle: true, // Note `mangle.properties` is `false` by default.
        module: false,
        // Deprecated
        output: null,
        format: {
          comments: false, // Remove comments
        },
        toplevel: false,
        nameCache: null,
        ie8: false,
        keep_classnames: undefined,
        keep_fnames: false,
        safari10: false,
      },
      exclude: []
    })
    ],
  },
  devServer: {
    hot: true,
    open: true,
    port: DEFAULT_WEBPACK_PORT,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    client: {
      logging: 'error', // Only log errors (no warnings or info)
    },
  },
  stats: 'errors-only',
  resolve: {
    alias: {
      three: path.resolve('./node_modules/three')
    },
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    fallback: {
      "fs": false,
      "path": require.resolve("path-browserify")
    },
  },
  experiments: {
    asyncWebAssembly: true,
  },
  performance: {
    hints: false
  }
};
