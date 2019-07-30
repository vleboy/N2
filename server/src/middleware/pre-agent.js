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
 * 自动设置id
 * 自动设置status
 * 自动设置level
 * 自动设置createAt
 */
router.post('/agent/create', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    // 查询上级代理
    let parent = inparam.parentId ? await mongodb.findOne('agent', { id: inparam.parentId }) : {}
    inparam.id = _.random(999999)
    inparam.status = 1
    inparam.parentId = parent.id || 0
    inparam.parentName = parent.userName || ''
    inparam.level = parent.level + 1 || 0
    inparam.levelIndex = parent.levelIndex ? `${parent.levelIndex},${inparam.id}` : inparam.id
    inparam.createAt = Date.now()
    // 入参检查
    if (!inparam.userName || !inparam.userPwd || !inparam.userNick) {
        ctx.body = { err: true, res: '请检查入参' }
    } else if (await mongodb.findOne('agent', { $or: [{ id: inparam.id }, { userName: inparam.userName }, { userNick: inparam.userNick }] })) {
        ctx.body = { err: true, res: '帐号已存在' }
    } else {
        return next()
    }
})

/**
 * 更新代理
 */
router.post('/agent/update', async (ctx, next) => {
    return next()
})

module.exports = router