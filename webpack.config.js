"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
var package_json_1 = __importDefault(require("./package.json"));
var srcDirPath = path_1.default.resolve(__dirname, 'src');
var distDirPath = path_1.default.resolve(__dirname, 'dist');
var port = process.env.PORT || 6664;
exports.default = {
    entry: {
        'math-hunger': path_1.default.resolve(srcDirPath, 'index.ts')
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
        port: port,
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
        new html_webpack_plugin_1.default({
            title: package_json_1.default.description
        })
    ]
};
