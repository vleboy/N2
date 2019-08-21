// 系统配置参数
const config = require('config')
// 路由相关
const Router = require('koa-router')
const router = new Router()
// 工具
const _ = require('lodash')
const Util = require('../util/util.js')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })

/**
 * 查询游戏记录
 */
router.get('/vround/page', async (ctx, next) => {
    const token = ctx.tokenVerify
    ctx.body.res.forEach(o => { o.sourceGameIdStr = Util.GameStrEnum[o.sourceGameId] })
})

module.exports = router