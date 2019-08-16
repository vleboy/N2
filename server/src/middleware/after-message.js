// 系统配置参数
const config = require('config')
// 路由相关
const Router = require('koa-router')
const router = new Router()
// 工具相关
const _ = require('lodash')
const Util = require('../util/util.js')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })

/**
 * 创建消息
 */
router.post('/message/create', async (ctx, next) => {
    const inparam = ctx.request.body
    ctx.body = { id: inparam.id, createAt: inparam.createAt }
})


/**
 * 查询消息
 */
router.get('/message/page', async (ctx, next) => {
    ctx.body.res.forEach(o => { o.projectStr = Util.MsgStrEnum[o.project] })
})

module.exports = router