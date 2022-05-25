//webpack.config.js
const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "production",
  devtool: "source-map",
  target: "node",
  entry: "./src/index.ts",
  node: {
    __dirname: false,
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "server.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        exclude: [/node_modules/],
        test: /\.ts?$/,
        loader: "ts-loader",
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  externals: [
    nodeExternals(),
    {
      "pg-hstore": "pg-hstore",
      bufferutil: "bufferutil",
      "utf-8-validate": "utf-8-validate",
    },
  ],
};
