const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (env = {}, opts = {}) => {
    const {
        p: isProduction,
        hot: hotByCli
    } = opts;

    process.env.NODE_ENV = isProduction ? 'production' : 'development';

    const aliases = {
        // device: path.resolve(__dirname, coreReactFolder, './js/hooks/device'),
        // i18n: 'util/i18n.util.instance'
    };

    return {
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? 'source-map' : 'eval-source-map',
        stats: {
            // turn off plugins logs
            children: false,
            warnings: false
        },
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'main.js',
            libraryTarget: 'var',
            library: 'bundle'
        },
        devServer: {
            writeToDisk: true,
            hot: false,
            inline: false,
            liveReload: false,
            stats: 'minimal',
            port: 3000,
            quiet: false
        },
        watchOptions: {
            ignored: '/node_modules/'
        },
        plugins: [
            new CopyWebpackPlugin(
                [
                    {
                        context: 'public',
                        from: '**/*',
                        to: path.resolve(__dirname, 'dist'),
                    }
                ],
                { copyUnmodified: true }
            ),
            new MiniCssExtractPlugin({
                filename: 'main.css'
            }),
            new CircularDependencyPlugin({
                exclude: /node_modules/,
                failOnError: true,
                cwd: process.cwd()
            }),
            new BundleAnalyzerPlugin({
                // Change to 'server' or remove to launch analyzer
                analyzerMode: 'disabled'
            }),
            // webpack bug: if --hot is provided - this plugin is loaded twice
            ...hotByCli
                ? []
                : [new webpack.HotModuleReplacementPlugin()],
            new OptimizeCssAssetsPlugin()
        ],
        optimization: {
            minimizer: [
                new TerserPlugin({
                    extractComments: false,
                    sourceMap: true,
                    terserOptions: {
                        safari10: true,
                        compress: {
                            inline: false,
                            unused: true
                        },
                        output: {
                            comments: false,
                            beautify: false
                        }
                    }
                })
            ]
        },
        module: {
            rules: [
                {
                    test: /\.js$|\.jsx$/,
                    exclude: /node_modules/,
                    use: ['babel-loader']
                },
                {
                    test: /\.worker\.js$/,
                    exclude: /node_modules/,
                    use: ['worker-loader']
                },
                {
                    test: /\.(png|jpe?g|gif|svg$)$/i,
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                        outputPath: 'images'
                    }
                },
                {
                    test: /\.(scss|css)$/,
                    exclude: /node_modules/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    localIdentName: '[folder]__[local]--[hash:base64:3]'
                                }
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: [
                                    require('autoprefixer')()
                                ]
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                implementation: require("sass")
                            }
                        }
                    ]
                }
            ]
        },
        resolve: {
            // alias: aliases,
            extensions: ['.js', '.jsx'],
            modules: [
                path.resolve(__dirname, 'src'),
                // external modules
                'node_modules'
            ]
        }
    };
};
