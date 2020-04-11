const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  devtool: "inline-source-map",
  entry: "./src/index.ts",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js",
  },
  devServer: {
    inline: true,
    contentBase: "./www",
    port: 3000,
    // Enable hot reloading
    hot: true,
    watchOptions: {
      // Delay the rebuild after the first change
      aggregateTimeout: 300,

      // Poll using interval (in ms, accepts boolean too)
      poll: 1000,
    },
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, exclude: /node_modules/, loader: "ts-loader" },
      { test: /\.js$/, use: ["source-map-loader"], enforce: "pre" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },
  plugins: [
    new webpack.WatchIgnorePlugin([
      path.join(__dirname, "node_modules")
    ]),
  ],
};
