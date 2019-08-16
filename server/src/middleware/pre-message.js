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
 * 创建消息
 * project:(公告/私信/站内信)
 * ownerId:消息送达人(全部/指定代理ID)
 * msg:消息体
 * createrId:创建人ID
 * createrName:创建人帐号
 * createrNick:创建人昵称
 */
router.post('/message/create', async (ctx, next) => {
    const inparam = ctx.request.body
    const mongodb = global.mongodb
    const token = ctx.tokenVerify
    if (!inparam.project || !inparam.msg) {
        return ctx.body = { err: true, res: '请检查入参' }
    }
    // 检查创建人
    let agent = await mongodb.collection(Util.CollectionEnum.agent).findOne({ id: token.id }, { projection: { _id: 0 } })
    if (!agent) {
        return ctx.body = { err: true, res: '帐号不存在' }
    }
    inparam.createrId = agent.id
    inparam.createrName = agent.userName
    inparam.createrNick = agent.userNick
    // 检查送达人
    if (inparam.role) {
        let collectionName = inparam.role == Util.RoleEnum.agent ? Util.CollectionEnum.agent : Util.CollectionEnum.player
        let user = await mongodb.collection(collectionName).findOne({ id: inparam.ownerId }, { projection: { _id: 0 } })
        if (!user) {
            return ctx.body = { err: true, res: '帐号不存在' }
        }
        inparam.ownerName = inparam.role == Util.RoleEnum.agent ? user.userName : user.playerName
        inparam.ownerNick = inparam.role == Util.RoleEnum.agent ? user.userNick : user.playerNick
    }
    inparam.id = await Util.getSeq('messageSeq')
    return next()
})

/**
 * 查询消息
 */
router.get('/message/page', async (ctx, next) => {
    let inparam = ctx.request.query
    // 设置分页参数
    if (inparam.startKey) {
        inparam.startKey = +inparam.startKey
    }
    inparam.findOption = { projection: { _id: 0 } }
    return next()
})

module.exports = router