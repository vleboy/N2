// 系统配置参数
const config = require('config')
// 路由相关
const Router = require('koa-router')
const router = new Router()
//工具相关
const _ = require('lodash')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })



/**
 * 查询代理流水
 */
router.get('/agentBill/query', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.query
    let mongodb = global.mongodb
    if (token.level == 0) {

    } else {

    }
    return next()
})


module.exports = router