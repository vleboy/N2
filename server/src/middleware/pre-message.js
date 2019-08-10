// 系统配置参数
const config = require('config')
// 路由相关
const Router = require('koa-router')
const router = new Router()
//工具相关
const _ = require('lodash')
const Util = require('../util/util.js')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })

/**
 * 创建消息
 */
router.post('/message/create', async (ctx, next) => {
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (!inparam.msg) {
        ctx.body = { err: true, res: '请检查入参' }
    } else {
        inparam.createAt = Date.now()
        inparam.id = await Util.getSeq('messageSeq')
        return next()
    }
})


/**
 * 查询消息
 */
router.get('/message/query', async (ctx, next) => {
    let inparam = ctx.request.query
    let mongodb = global.mongodb

    return next()
})

/**
 * 删除消息
 */

module.exports = router