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
 * 查询奖金页面
 */
router.get('/profit/page', async (ctx, next) => {
    const token = ctx.tokenVerify
    // ctx.body.res.forEach(o => { o.sourceGameIdStr = Util.GameStrEnum[o.sourceGameId] })
})

module.exports = router