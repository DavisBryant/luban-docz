#!/usr/bin/env node
const path = require('path')
const version = require('./version')
const program = require('commander')
const chalk = require('chalk');
const node = require('./node')

// 选项
program
    .version(version)

// 命令
program
    .command('start')
    .description('执行start命令，一般多用于本地开发')
    .option('--config [confUrl]', 'config配置路径')
    .action(async function(options) {
        // docz配置进行合并并重新写入
        if (options.config) {
            await node.mergeDoczConf(options.config, () => {
                const npmRC = require('./npmrc')
                npmRC('start')
            })
        }
        console.log(chalk.green(`执行命令为：docz start`));
    });
program
    .command('build')
    .description('执行build命令，开始打包项目文档')
    .option('-c, --config [url]', "config docz配置路径")
    .action(async function(options) {
        // docz配置进行合并并重新写入
        if (options.config) {
            await node.mergeDoczConf(options.config, () => {
                const npmRC = require('./npmrc')
                npmRC('build')
            })
        }
        console.log(chalk.green(`执行命令为：docz build`));
    });

program
    .command('clean')
    .description('执行clean命令，清除掉本地的残留的文档文件')
    .action(function(env) {
        console.log(`执行命令为：docz build`);
        console.log(`执行环境为：${env || '暂无环境设置'}`);
        // npmRC('clean')
    });
program.parse(process.argv);