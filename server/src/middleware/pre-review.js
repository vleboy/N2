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
router.get('/review/page', async (ctx, next) => {
    let inparam = ctx.request.query
    let mongodb = global.mongodb
    if (inparam.proposerId) {
        inparam.proposerId = +inparam.proposerId
    }
    // 设置分页参数
    inparam.limit = 200
    inparam.sortBy = 'id'
    inparam.sortOrder = -1
    if (inparam.startKey) {
        inparam.startKey = +inparam.startKey
    }
    return next()
})



module.exports = router