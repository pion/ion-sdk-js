const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = [{
  entry: './src/index.ts',
  devtool: 'eval-source-map',
  output: {
    filename: 'ion-sdk.min.js',
    library: 'IonSDK',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
  },
},{
  entry: './src/connector/index.ts',
  devtool: 'source-map',
  output: {
    filename: 'ion-connector.min.js',
    library: 'Ion',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
  },
  optimization: {
    minimizer: [new UglifyJsPlugin({
      sourceMap: false
    })]
  },
},{
  entry: './src/signal/grpc-web-impl.ts',
  devtool: 'source-map',
  output: {
    filename: 'grpc-web.min.js',
    library: 'Signal',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
  },
  optimization: {
    minimizer: [new UglifyJsPlugin({
      sourceMap: false
    })]
  },
},{
  entry: './src/signal/json-rpc-impl.ts',
  devtool: 'eval-source-map',
  output: {
    filename: 'json-rpc.min.js',
    library: 'Signal',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
  },
}];
