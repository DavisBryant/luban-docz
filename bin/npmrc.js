const WebpackDevServer = require("webpack-dev-server");
const webpack = require('webpack');
const webpackConfig = require('../webpack.config')
const doczConfig = require('../docz.config')
const defaultConfig = require('./default.config')

// 构造器
const compiler = webpack(webpackConfig);

const start = () => {
    const server = new WebpackDevServer(compiler);
    server.listen(doczConfig.port || defaultConfig.port || 8888, "localhost", function() {});
}

const build = () => {
    const watching = compiler.watch({
        /* watchOptions */
    }, (err, stats) => {
        //处理webpack本身的error
        if (err) {
            console.error(err.stack || err);
            if (err.details) {
                console.error(err.details);
            }
            return;
        }

        const info = stats.toJson();
        //处理代码编译中产生的error
        if (stats.hasErrors()) {
            console.error(info.errors);
        }
        //处理代码编译中产生的warning
        if (stats.hasWarnings()) {
            console.warn(info.warnings)
        }

        console.log(
            stats.toString({
                // Add console colors
                colors: true
            })
        )

        watching.close()
    });
}

const npmRC = (cmd) => {
    if (cmd === 'start') {
        start()
    }

    if (cmd === 'build') {
        build()
    }
}

module.exports = npmRC