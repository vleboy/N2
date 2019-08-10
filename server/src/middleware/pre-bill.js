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
 * 查询账单流水
 */
router.get('/bill/page', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.query
    let mongodb = global.mongodb
    if (inparam.ownerId) {
        inparam.ownerId = +inparam.ownerId
    }
    if (token.role == Util.RoleEnum.agent) {
        inparam.parentId = token.id
    }
    // 设置分页参数
    inparam.limit = 100
    inparam.sortBy = 'id'
    inparam.sortOrder = -1
    if (inparam.startKey) {
        inparam.startKey = +inparam.startKey
    }
    return next()
})

module.exports = router