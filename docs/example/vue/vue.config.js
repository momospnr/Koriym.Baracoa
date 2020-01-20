const path = require("path");
const merge = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const TARGET_NODE = process.env.WEBPACK_TARGET === "node";
const target = TARGET_NODE ? "server" : "client";

module.exports = {
  css: {
    extract: false
  },
  outputDir: path.join(__dirname, `dist/${target}`),
  filenameHashing: false,
  configureWebpack: () => ({
    entry: `./src/entry-${target}.js`,
    devtool: "source-map",
    target: TARGET_NODE ? "async-node" : "web",
    node: TARGET_NODE ? undefined : false,
    externals: TARGET_NODE ? nodeExternals({ whitelist: /\.css$/ }) : undefined,
    output: {
      libraryTarget: TARGET_NODE ? "commonjs2" : undefined,
      filename: "[name].bundle.js",
      chunkFilename: "[name].bundle.js"
    },
    optimization: {
      splitChunks: TARGET_NODE ? false : undefined
    },
    plugins: TARGET_NODE ? undefined : [new VueSSRClientPlugin()]
  }),
  chainWebpack: config => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap(options => {
        merge(options, {
          optimizeSSR: false
        });
      });
  }
};
