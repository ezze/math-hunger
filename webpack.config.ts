import path from 'path';

import HtmlPlugin from 'html-webpack-plugin';

import packageJson from './package.json';

const srcDirPath = path.resolve(__dirname, 'src');
const distDirPath = path.resolve(__dirname, 'dist');

const port = process.env.PORT || 6664;

export default {
  entry: {
    'math-hunger': path.resolve(srcDirPath, 'index.ts')
  },
  output: {
    path: distDirPath,
    filename: '[name].[contenthash:6].js'
  },
  devServer: {
    historyApiFallback: true,
    contentBase: distDirPath,
    publicPath: '/',
    compress: true,
    progress: true,
    hot: true,
    port,
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new HtmlPlugin({
      title: packageJson.description
    })
  ]
};
