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
 * 查询所有的（充值/提现）的申请单
 */
router.get('/review/query', async (ctx, next) => {
    let inparam = ctx.request.query
    let mongodb = global.mongodb

    return next()
})



module.exports = router