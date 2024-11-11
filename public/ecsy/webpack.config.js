const path = require("path");

module.exports = {
  context: path.resolve(__dirname, "src"),
  devServer: {
    static: {
      directory: path.resolve(__dirname, "build"),
    },
    compress: true,
    port: 8080,
  },
  mode: "development",
  entry: "./Main.ts",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "out.js",
    path: path.resolve(__dirname, "build"),
  },
};
