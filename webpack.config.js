const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

function srcPath(subdir) {
    return path.join(__dirname, 'src', subdir);
}

module.exports = {
    entry: ['webpack/hot/poll?100', './src/main.ts'],
    watch: true,
    target: 'node',
    externals: [
        nodeExternals({
            whitelist: ['webpack/hot/poll?100'],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    mode: 'development',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'main.js',
    },
    resolve: {
        alias: {
            common: srcPath('common'),
            decorators: srcPath('decorators'),
            exceptions: srcPath('exceptions'),
            filters: srcPath('filters'),
            guards: srcPath('guards'),
            interceptors: srcPath('interceptors'),
            interfaces: srcPath('interfaces'),
            middlewares: srcPath('middlewares'),
            modules: srcPath('modules'),
            providers: srcPath('providers'),
            shared: srcPath('shared'),
        },
    },
};
