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
 * 注册玩家
 * 自动设置createAt
 */
router.post('/player/create', async (ctx, next) => {
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    let parent = {}
    inparam.id = _.random(10000000, 99999999)
    if (!inparam.playerName || !inparam.playerPwd || !inparam.parentId || !inparam.playerNick) {
        return ctx.body = { err: true, res: '请检查入参' }
    }
    if (inparam.playerName.length < 3 || inparam.playerName.length > 20 || inparam.playerPwd.length < 6 || inparam.playerPwd.length > 20 || inparam.playerNick.length < 3 || inparam.playerNick.length > 20) {
        return ctx.body = { err: true, res: '参数不合法' }
    }
    if (await mongodb.collection(Util.CollectionEnum.player).findOne({ $or: [{ playerName: inparam.playerName }, { playerNick: inparam.playerNick }, { id: inparam.id }] })) {
        return ctx.body = { err: true, res: '帐号/昵称已存在' }
    }
    if (!(parent = await mongodb.collection(Util.CollectionEnum.agent).findOne({ id: inparam.parentId }))) {
        return ctx.body = { err: true, res: '所属代理不存在' }
    }
    inparam.status = Util.StatusEnum.Enable
    inparam.parentId = parent.id
    inparam.parentName = parent.userName
    inparam.parentNick = parent.nickName
    inparam.role = Util.RoleEnum.player
    inparam.lastBalanceTime = 0
    inparam.lastBalance = 0
    inparam.createAt = Date.now()
    return next()
})

/**
 * 更新玩家
 */
router.post('/player/update', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (!inparam.id) {
        return ctx.body = { err: true, res: '请检查入参' }
    }
    //只允许更新的参数
    let diffArr = _.difference(Object.keys(inparam), ['id', 'playerPwd', 'playerNick', 'status'])
    if (diffArr.length > 0) {
        return ctx.body = { err: true, res: `以下参数不能更新【${diffArr.join(',')}】` }
    }
    let playerInfo = ''
    if (inparam.playerPwd && (inparam.playerPwd.length < 6 || inparam.playerPwd.length > 20)) {
        ctx.body = { err: true, res: '密码长度不合法' }
    } else if (inparam.playerNick && (inparam.playerNick.length < 3 || inparam.playerNick.length > 20)) {
        ctx.body = { err: true, res: '昵称长度不合法' }
    } else if (!(playerInfo = await mongodb.collection(Util.CollectionEnum.player).findOne({ id: inparam.id }))) {
        ctx.body = { err: true, res: '玩家不存在' }
    } else {
        if (inparam.status == Util.StatusEnum.Disable || inparam.status == Util.StatusEnum.Enable) {
            if (token.role == Util.RoleEnum.agent && token.id != playerInfo.parentId) {
                return ctx.body = { err: true, res: '不能越级操作' }
            }
        }
        return next()
    }
})

/**
 * 查询玩家
 */
router.get('/player/page', async (ctx, next) => {
    let inparam = ctx.request.query
    let mongodb = global.mongodb
    if (inparam.id) {
        inparam.id = +inparam.id
    }
    // 设置分页参数
    inparam.limit = 6
    inparam.sortBy = 'createAt'
    inparam.sortOrder = -1
    if (inparam.startKey) {
        inparam.startKey = +inparam.startKey
    }
    inparam.findOption = { projection: { id: 1, playerName: 1, playerNick: 1, status: 1, role: 1, createAt: 1, lastBalanceTime: 1, lastBalance: 1, _id: 0 } }
    return next()
})

module.exports = router