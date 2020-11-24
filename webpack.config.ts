import path from 'path';

import webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlPlugin from 'html-webpack-plugin';
import ForkTsCheckerPlugin from 'fork-ts-checker-webpack-plugin';

import packageJson from './package.json';

const srcDirPath = path.resolve(__dirname, 'src');
const distDirPath = path.resolve(__dirname, 'dist');

const port = process.env.PORT || 6664;

declare interface ObjectWithAnyProps {
  [index: string]: any;
}

declare interface WebpackConfiguration extends webpack.Configuration {
  devServer?: ObjectWithAnyProps;
}

const config = (env: string, argv: ObjectWithAnyProps): WebpackConfiguration => {
  const { mode } = argv;
  return {
    entry: {
      'math-hunger': {
        import: [path.resolve(srcDirPath, 'index.tsx')]
      }
    },
    output: {
      path: distDirPath,
      filename: '[name].[contenthash:6].js'
    },
    devtool: mode === 'development' ? 'source-map' : false,
    devServer: {
      historyApiFallback: true,
      contentBase: distDirPath,
      publicPath: '/',
      compress: true,
      progress: true,
      hot: true,
      port
    },
    module: {
      rules: [{
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true
        }
      }]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlPlugin({
        title: packageJson.description
      }),
      new ForkTsCheckerPlugin()
    ]
  };
};

export default config;
