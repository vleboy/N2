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
 * 查询所有的（充值/提现）的申请单
 */
router.get('/review/page', async (ctx, next) => {
    let inparam = ctx.request.query
    if (inparam.proposerId) {
        inparam.proposerId = +inparam.proposerId
    }
    if (inparam.project == 'all') {
        delete inparam.project
    }
    if (inparam.role == 'all') {
        delete inparam.role
    }
    if (inparam.status == 'all') {
        delete inparam.status
    } else if (inparam.status || inparam.status == Util.ReviewEnum.Process) {
        inparam.status = +inparam.status
    }
    // 设置分页参数
    if (inparam.startKey) {
        inparam.startKey = +inparam.startKey
    }
    inparam.findOption = { projection: { _id: 0 } }
    return next()
})



module.exports = router