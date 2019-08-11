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
 * 查询审核单
 */
router.get('/review/page', async (ctx, next) => {
    const token = ctx.tokenVerify
})

module.exports = router