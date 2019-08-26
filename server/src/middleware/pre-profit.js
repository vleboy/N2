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
 * 查询奖金页面
 */
router.get('/profit/page', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.query
    if (inparam.ownerId) {
        inparam.ownerId = +inparam.ownerId
    }
    if (inparam.project == 'all') {
        delete inparam.project
    }
    if (inparam.role == 'all') {
        delete inparam.role
    }
    if (inparam.stauts == 'all') {
        delete inparam.stauts
    }
    // 代理或玩家，查看自己的奖金
    if (token.role != Util.RoleEnum.admin) {
        inparam.ownerId = token.id
    }
    // 设置分页参数
    if (inparam.startKey) {
        inparam.startKey = +inparam.startKey
    }
    inparam.findOption = { projection: { _id: 0 } }
    return next()
})

module.exports = router