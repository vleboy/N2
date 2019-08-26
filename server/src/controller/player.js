const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const _ = require('lodash')
const Util = require('../util/util.js')
const Router = require('koa-router')
const router = new Router()

/**
 * 玩家登陆
 */
router.post('/login', async (ctx, next) => {
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    let player = await mongodb.collection(Util.CollectionEnum.player).findOne({ playerName: inparam.playerName })
    if (!player) {
        ctx.body = { err: true, res: '帐号不存在' }
    } else if (!bcrypt.compareSync(player.playerPwd, inparam.playerPwd)) {
        ctx.body = { err: true, res: '密码不正确' }
    } else {
        //更新登录时间 和 IP
        mongodb.collection(Util.CollectionEnum.player).updateOne({ playerName: inparam.playerName }, { $set: { lastLoginAt: Date.now(), lastLoginIP: ctx.request.ip } })
        let token = jwt.sign({
            role: player.role,
            id: player.id,
            playerName: player.playerName,
            playerNick: player.playerNick
        }, config.auth.secret)
        ctx.body = {
            id: player.id,
            mode: player.mode,
            modeValue: player.modeValue,
            playerNick: player.playerNick,
            playerName: player.playerName,
            parentId: player.parentId,
            parentName: player.parentName,
            parentNick: player.parentNick,
            token
        }
    }
})

/**
 * 获取玩家实时数据
 */
router.get('/realtime', async (ctx, next) => {
})

/**
 * 获取玩家余额
 */
router.get('/getBalance', async (ctx, next) => {
    const token = ctx.tokenVerify
    let player = await global.mongodb.collection(Util.CollectionEnum.player).findOne({ id: token.id }, { projection: { id: 1, balance: 1, _id: 0 } })
    if (!player) {
        return ctx.body = { err: true, res: '玩家不存在' }
    }
    let { mixAmount, lastCommissionTime } = await Util.getPlayerCommission(player)
    let data = { balance: +player.balance.toFixed(2), mixAmount, lastCommissionTime: lastCommissionTime || '-' }
    ctx.body = data
})

module.exports = router