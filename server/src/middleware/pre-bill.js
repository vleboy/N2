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
    if (inparam.ownerId) {
        inparam.ownerId = +inparam.ownerId
    }
    if (inparam.project == 'all') {
        delete inparam.project
    }
    // 代理APP，查看自己的账单流水
    if (token.role == Util.RoleEnum.agent) {
        inparam.ownerId = token.id
        inparam.limit = 50
    }
    // 玩家APP，查看自己的游戏记录
    if (token.role == Util.RoleEnum.player) {
        inparam.ownerId = token.id
        inparam.limit = 50
    }
    // 设置分页参数
    if (inparam.startKey) {
        inparam.startKey = +inparam.startKey
    }
    inparam.findOption = { projection: { _id: 0 } }
    return next()
})

module.exports = router