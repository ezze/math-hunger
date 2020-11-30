import path from 'path';

import webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ForkTsCheckerPlugin from 'fork-ts-checker-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

import packageJson from './package.json';

const { DefinePlugin } = webpack;

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
      filename: mode === 'development' ? '[name].js' : '[name].[contenthash:6].js'
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
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        },
        include: [srcDirPath]
      }, {
        test: /\.less$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../'
          }
        }, {
          loader: 'css-loader'
        }, {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true
            }
          }
        }]
      }, {
        test: /\.(jpg|png)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[contenthash:6].[ext]'
          }
        },
        include: [srcDirPath]
      }, {
        test: /\.(woff2?)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[contenthash:6].[ext]'
          }
        }
      }, {
        test: /\.mp3$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'audio/[name].[contenthash:6].[ext]'
          }
        },
        include: [srcDirPath]
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
      new MiniCssExtractPlugin({
        filename: `css/${mode === 'development' ? '[name].css' : '[name].[contenthash:6].css'}`,
        chunkFilename: `css/${mode === 'development' ? '[name].css' : '[name].[contenthash:6].css'}`
      }),
      new ForkTsCheckerPlugin(),
      new DefinePlugin({
        appVersion: JSON.stringify(packageJson.version)
      })
    ],
    optimization: {
      minimize: mode === 'production',
      minimizer: [
        new TerserPlugin({
          extractComments: false
        }),
        new CssMinimizerPlugin()
      ]
    }
  };
};

export default config;
