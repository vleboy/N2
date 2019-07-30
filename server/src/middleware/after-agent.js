// 系统配置参数
const config = require('config')
// 路由相关
const Router = require('koa-router')
const router = new Router()
// 工具相关
const _ = require('lodash')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })

/**
 * 创建代理
 * 返回agentId
 */
router.post('/agent/create', async (ctx, next) => {
    let inparam = ctx.request.body
    // let mongodb = global.mongodb
    ctx.body = { userId: inparam.userId, createAt: inparam.createAt }
})

router.post('/agent/query', async (ctx, next) => {
    ctx.body.res = _.orderBy(ctx.body.res, 'createAt', 'desc')
})

module.exports = router