#!/usr/bin/env node
'use strict'
const program = require('commander')
const weinreDelegate = require('./weinre/weinreDelegate')
const colors = require('colors')
const http = require('http')

program
    .version(require('../package.json').version)
    .option('-p, --port [value]', 'start port')
    .option('-g, --guiPort [value]', 'webgui start port')
    .option('-i, --showIframe [value]', 'spy iframe window')
    .option('-b, --autoDetectBrowser [value]', 'Auto detect Browser Request')
    .option('-e, --externalProxy [value]', 'set external Proxy')
    .option('-c, --cache [value]', 'set no cache')
    .option('-w, --contentEditable [value]', 'set content editable')

program.parse(process.argv)

var cusSpyProxyPort = program.port || 9888

var cusSpyGuiPort = program.guiPort || 19888

var cusShowIframe = false
if (program.showIframe === 'true') {
    cusShowIframe = true
}

var autoDetectBrowser = false
if (program.autoDetectBrowser === 'true') {
    autoDetectBrowser = true
}

var cusCache = false
if (program.cache === 'true') {
    cusCache = true
}

var cusContentEditable = false
if (program.contentEditable === 'true') {
    cusContentEditable = true
}

weinreDelegate.createCA()

let tempServer = new http.Server()

var createTempServerPromise = port => {
    return new Promise((resolve, reject) => {
        tempServer.listen(port, () => {
            tempServer.close(() => {
                resolve()
            })
        })
        tempServer.on('error', e => {
            console.error(colors.red('警告：启动失败!！'))
            console.error(colors.red('检查端口 ' + port + ' 是否被占用，或尝试更换启动端口'))
            reject()
        })
    })
}

var tempServerPromise = createTempServerPromise(cusSpyProxyPort)

tempServerPromise.then(
    () => {
        weinreDelegate.run({
            cusExternalProxy: program.externalProxy,
            cusSpyProxyPort,
            cusSpyGuiPort,
            cusShowIframe,
            cusAutoDetectBrowser: autoDetectBrowser,
            cusCache,
            cusContentEditable
        })
    },
    e => {
        // throw e
    }
)
