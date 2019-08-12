// 系统配置参数
const config = require('config')
// 路由相关
const Router = require('koa-router')
const router = new Router()
//工具相关
const _ = require('lodash')
const Util = require('../util/util')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })


/**
 * 查询账单流水
 */
router.get('/bill/query', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.query
    let mongodb = global.mongodb
    if (inparam.ownerId) {
        inparam.ownerId = +inparam.ownerId
    }
    if (token.role == Util.RoleEnum.agent) {
        inparam.parentId = token.id
    }
    return next()
})

module.exports = router