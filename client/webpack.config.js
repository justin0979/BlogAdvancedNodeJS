const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: ["./src"],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/", // without /, kept getting 404 errors when refreshing with redux-form
  },
  mode: "development",
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  devServer: {
    contentBase: "build",
    host: "0.0.0.0", // added for nginx & docker configs
    port: 3000,
    hot: true,
    historyApiFallback: true, // use for routing
    overlay: true,
    //public: "devconfig:80", // change devconfig if needed to whatever app is named (e.g. client:80), added with nginx use
    proxy: [
      {
        context: ["/auth", "/api"],
        target: "http://localhost:5000",
      },
    ], // <--- use if working with backend, paths are just examples.
  },
  resolve: {
    modules: ["src", "node_modules"],
    extensions: [
      ".js",
      ".jsx",
      ".css",
      ".scss",
      ".jpg",
      ".jpeg",
      ".png",
      ".svg",
      ".gif",
      ".ttf",
      ".woff",
      ".woff2",
      ".eot",
    ],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.s?css$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.html$/,
        use: "html-loader",
      },
      {
        test: /\.(jpe?g|png|gif|svg|ttf|woff(2)?|eot)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]",
            },
          },
          "image-webpack-loader",
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new Dotenv({
      path:
        process.env.NODE_ENV === "development"
          ? "./.env.development"
          : "./.env.production",
    }),
  ],
};
