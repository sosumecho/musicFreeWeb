const axios = require('axios')
const fs = require('fs')
const qs = require('qs')
const dayjs= require('dayjs')
const bigInt = require('big-integer')
const cheerio = require('cheerio')
const he = require('he')
const CryptoJs = require('crypto-js')

axios.defaults.timeout = 15000

const sha256 = CryptoJs.SHA256


const packages= {
    cheerio, 'crypto-js': CryptoJs, axios, dayjs, 'big-integer': bigInt, qs, he,
}

const _require = (packageName) => {
    const pkg = packages[packageName]
    pkg.default = pkg
    return pkg
}


//#region 插件类
class Plugin {
    /** 插件名 */
    name
    /** 插件的hash，作为唯一id */
    hash
    /** 插件状态信息 */
    stateCode
    /** 插件的实例 */
    instance
    /** 插件路径 */
    path

    constructor(funcCode, pluginPath) {
        let _instance
        const _module = {exports: {}}
        try {
            if (typeof funcCode === 'string') {
                // 插件的环境变量
                const env = {
                    getUserVariables: () => {
                        return {}
                    }, os: process.platform,
                }
                const _process = {
                    platform: process.platform, env
                }
                // eslint-disable-next-line no-new-func
                _instance = Function(`
                    'use strict';
                    return function(require, __musicfree_require, module, exports, console, env, process) {
                        ${funcCode}
                    }
                `)()(_require, _require, _module, _module.exports, console, env, _process)
                if (_module.exports.default) {
                    _instance = _module.exports.default
                } else {
                    _instance = _module.exports
                }
            } else {
                _instance = funcCode()
            }
            // 插件初始化后的一些操作
            if (Array.isArray(_instance.userVariables)) {
                _instance.userVariables = _instance.userVariables.filter((it) => it?.key)
            }
            this.checkValid(_instance)
        } catch (e) {
            this.stateCode = "CANNOT PARSE"
            if (e?.stateCode) {
                this.stateCode = e.stateCode
            }

            _instance = e?.instance ?? {
                _path: '', platform: '', appVersion: '', async getMediaSource() {
                    return null
                }, async search() {
                    return {}
                }, async getAlbumInfo() {
                    return null
                }
            }
        }
        this.instance = _instance
        this.path = pluginPath
        this.name = _instance.platform
        if (this.instance.platform === '' || this.instance.platform === undefined) {
            this.hash = ''
        } else {
            if (typeof funcCode === 'string') {
                this.hash = sha256(funcCode).toString()
            } else {
                this.hash = sha256(funcCode.toString()).toString()
            }
        }

        // 放在最后
    }

    checkValid(_instance) {

        return true
    }
}

module.exports = Plugin
