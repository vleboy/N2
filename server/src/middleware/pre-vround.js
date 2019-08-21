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
 * 查询游戏记录
 */
router.get('/vround/page', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.query
    if (inparam.ownerId) {
        inparam.ownerId = +inparam.ownerId
    }
    if (inparam.project == 'all') {
        delete inparam.project
    }
    // 代理APP，查看自己玩家的游戏记录
    if (token.role == Util.RoleEnum.agent) {
        inparam.parentId = token.id
    }
    // 设置分页参数
    if (inparam.startKey) {
        inparam.startKey = +inparam.startKey
    }
    inparam.findOption = { projection: { _id: 0 } }
    return next()
})

module.exports = router