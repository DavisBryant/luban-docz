const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const doczConfig = require('./docz.config.js')
const defaultConfig = require('./bin/default.config')

const htmlTemplate = doczConfig.htmlTemplate === defaultConfig.htmlTemplate
    ? path.resolve(__dirname, defaultConfig.htmlTemplate)
    : path.resolve(doczConfig.projRootPath, doczConfig.htmlTemplate)

console.log(htmlTemplate);

module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, 'src/main.js'), // 项目入口文件
    output: { // 配置输出选项
        path: path.resolve(__dirname, './dist'), // 配置输出的路径
        filename: '[name].[chunkhash].js' // 配置输出的文件名
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ],
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.css', '.json']
    },
    plugins:[ // 添加plugins节点配置插件
        new htmlWebpackPlugin({
            template: htmlTemplate,//模板路径
            // template: path.resolve(__dirname, 'src/index.html'),//模板路径
            filename: 'index.html'//自动生成的HTML文件的名称
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            ...process.env.stringified,
        })
    ],
    devServer:{
        hot: true,
        open: true,
        historyApiFallback: false,
        contentBase: path.join(__dirname, "./dist"),
        compress: true,
        port: doczConfig.port || defaultConfig.port || 8888,
        proxy: {},
        staticOptions: {},
        quiet: false,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        headers: { "X-Custom-Header": "yes" },
        stats: { colors: true }
    }
}