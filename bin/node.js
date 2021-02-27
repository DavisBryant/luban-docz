const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const glob = require('glob');
const merge = require('lodash/merge')

const writeDoczConf = (result, call) => {
    const saveConfUrl = path.join(__dirname, '../docz.config.js')
    console.log(result);
    // 开始写入文件
    const ctx = `module.exports = ${JSON.stringify(result)}`
    fs.writeFile(saveConfUrl, ctx, 'utf8', function (err, ss) {
        if (err){
            console.log(err)
        };
        console.log('写入成功')
        call && call()
    });
}

const readMd = (conf) => {
    const {source, projRootPath} = conf
    const keys = Object.keys(source)
    let mdSource = {}
    keys.forEach((item) => {
        Object.assign(mdSource, {[item]: glob.sync(path.resolve(projRootPath, source[item], '**/*.md'))})
    })
    return mdSource
}

const mergeDoczConf = (confUrl, call) => {
    // 项目根路径
    const rootPath = path.resolve(confUrl)
    const rooturl = path.resolve('./')
    const defaultConf = require('./default.config')
    const currentConf = require(path.resolve(confUrl))
    const conf = merge(JSON.parse(
        JSON.stringify(defaultConf)),
        JSON.parse(JSON.stringify(currentConf)),
        {
            projRootPath: rootPath.substring(0, rootPath.lastIndexOf('\\') + 1),
            projRootUrl: rooturl
        })
    const coverConf = {
        // 项目根配置的路径
        projRootMdSource: readMd(conf),
    }
    writeDoczConf(merge(conf, {...coverConf}), call)
}

module.exports = {
    mergeDoczConf
}