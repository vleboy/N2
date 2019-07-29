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
 * 自动设置roomId
 * 自动设置status
 * 自动设置owner
 * 自动设置createAt
 */
router.post('/agent/create', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    inparam.id = _.random(999999)
    inparam.status = 1
    inparam.owner = token._id
    inparam.createAt = Date.now()

    if (inparam.name.length > 16) {
        ctx.body = { err: true, res: '房间名称太长' }
    } else if (await mongodb.findOne('room', { $or: [{ id: inparam.id }, { name: inparam.name }] })) {
        ctx.body = { err: true, res: '房间已存在' }
    } else {
        return next()
    }
})

module.exports = router