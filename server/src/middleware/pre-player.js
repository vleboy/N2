// 系统配置参数
const config = require('config')
// 路由相关
const Router = require('koa-router')
const router = new Router()
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })

/**
 * 注册玩家
 * 自动设置createAt
 */
router.post('/player/create', async (ctx, next) => {
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    let agentInfo = ''
    if (!inparam.playerName || !inparam.playerPwd || !parentId || inparam.playerName.length > 20 || inparam.playerPwd.length > 20 || inparam.playerName.length < 3 || inparam.playerPwd.length < 6) {
        ctx.body = { err: true, res: '请检查入参' }
    } else if (await mongodb.findOne('player', { playerName: inparam.playerName })) {
        ctx.body = { err: true, res: '帐号已存在' }
    } else if (!(agentInfo = await mongodb.findOne('agent', { id: inparam.parentId }))) {
        ctx.body = { err: true, res: '所属代理不存在' }
    } else {
        let flag = true
        while (flag) {
            inparam.id = _.random(99999999)
            if (!await mongodb.findOne('player', { id: inparam.id })) {
                flag = false
            }
        }
        inparam.status = 1
        inparam.parentId = agentInfo.id
        inparam.parentName = agentInfo.userName
        inparam.createAt = Date.now()
        return next()
    }
})

/**
 * 更新玩家
 */
router.post('/player/update', async (ctx, next) => {
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (inparam.playerPwd && (inparam.playerPwd.length < 6 || inparam.playerPwd.length > 20)) {
        ctx.body = { err: true, res: '密码长度不合法' }
    } else if (inparam.playerNick && (inparam.playerNick.length < 3 || inparam.playerNick.length > 20)) {
        ctx.body = { err: true, res: '昵称长度不合法' }
    } else if (!await mongodb.findOne('player', { id: inparam.id })) {
        ctx.body = { err: true, res: '玩家不存在' }
    } else {
        return next()
    }
})

/**
 * 查询玩家
 */
router.get('/player/query', async (ctx, next) => {
    let inparam = ctx.request.query
    let mongodb = global.mongodb

    return next()
})

module.exports = router