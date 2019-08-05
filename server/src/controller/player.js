const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const _ = require('lodash')
const Router = require('koa-router')
const router = new Router()

/**
 * 玩家登陆
 */
router.post('/login', async (ctx, next) => {
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    let player = await mongodb.findOne('player', { playerName: inparam.playerName })
    if (!player) {
        ctx.body = { err: true, res: '帐号不存在' }
    } else if (!bcrypt.compareSync(player.playerPwd, inparam.playerPwd)) {
        ctx.body = { err: true, res: '密码不正确' }
    } else {
        let token = jwt.sign({
            role: player.role,
            id: player.id,
            playerName: player.playerName,
            playerNick: player.playerNick
        }, config.auth.secret)
        ctx.body = { id: player.id, playerNick: player.playerNick, token }
    }
})

/**
 * 玩家加减点操作
 */
router.post('/handlerPoint', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (!inparam.ownerId || !inparam.amount || !inparam.project) {
        return ctx.body = { err: true, res: '请检查入参' }
    }
    let playerInfo = await mongodb.findOne('player', { id: inparam.ownerId })
    if (!playerInfo) {
        return ctx.body = { err: true, res: '玩家不存在' }
    }
    if (token.level != 0) {//代理，只能操作直属一级
        if (token.id != playerInfo.parentId) {
            return ctx.body = { err: true, res: '不能操作其他代理玩家' }
        }
        if (inparam.project == '充值') {
            let balance = await getAgentBalance(token.id)
            if (balance < inparam.amount) {
                return ctx.body = { err: true, res: '余额不足' }
            }
            //当前代理减点
            await mongodb.insert('agentBill', { billId: _.random(99999999), project: '减点', amount: Math.abs(inparam.amount) * -1, ownerId: token.id, ownerName: token.userName, createAt: Date.now() })
            //请求玩家加点
            await mongodb.insert('playerBill', { billId: _.random(99999999), project: '加点', amount: Math.abs(inparam.amount), ownerId: playerInfo.id, ownerName: playerInfo.playerName, createAt: Date.now() })
        } else if (inparam.project == '提现') {
            let balance = await getPlayerBalance(playerInfo.id)
            if (balance < inparam.amount) {
                return ctx.body = { err: true, res: '余额不足' }
            }
            //当前代理加点
            await mongodb.insert('agentBill', { billId: _.random(99999999), project: '加点', amount: Math.abs(inparam.amount), ownerId: token.id, ownerName: token.userName, createAt: Date.now() })
            //请求玩家减点
            await mongodb.insert('playerBill', { billId: _.random(99999999), project: '减点', amount: Math.abs(inparam.amount) * -1, ownerId: playerInfo.id, ownerName: playerInfo.playerName, createAt: Date.now() })
        }
    } else { //系统
        if (inparam.project == '充值') {
            //当前代理减点
            await mongodb.insert('agentBill', { billId: _.random(99999999), project: '减点', amount: Math.abs(inparam.amount) * -1, ownerId: token.id, ownerName: token.userName, createAt: Date.now() })
            //请求玩家加点
            await mongodb.insert('playerBill', { billId: _.random(99999999), project: '加点', amount: Math.abs(inparam.amount), ownerId: playerInfo.id, ownerName: playerInfo.playerName, createAt: Date.now() })
        } else if (inparam.project == '提现') {
            let balance = await getPlayerBalance(playerInfo.id)
            if (balance < inparam.amount) {
                return ctx.body = { err: true, res: '余额不足' }
            }
            //当前代理加点
            await mongodb.insert('agentBill', { billId: _.random(99999999), project: '加点', amount: Math.abs(inparam.amount), ownerId: token.id, ownerName: token.userName, createAt: Date.now() })
            //请求代理减点
            await mongodb.insert('playerBill', { billId: _.random(99999999), project: '减点', amount: Math.abs(inparam.amount) * -1, ownerId: playerInfo.id, ownerName: playerInfo.playerName, createAt: Date.now() })
        }
    }
    ctx.body = { err: false, msg: '操作成功' }
})

//获取代理的余额
async function getAgentBalance(agentId) {
    let balance = 0
    let agentInfo = await mongodb.findOne('agent', { id: agentId })
    if (!agentInfo) {
        throw { err: true, res: '代理不存在' }
    }
    if (agentInfo.level == 0) {
        balance = 'system'
        return balance
    }
    let agentGroupArr = await mongodb.db.collection('agentBill').aggregate([{ $match: { ownerId: agentId } }, { $group: { _id: "$ownerId", count: { $sum: "$amount" } } }]).toArray()
    for (let item of agentGroupArr) {
        if (item._id == agentInfo.id) {
            balance = item.count
            return balance
        }
    }
    return balance
}

//获取玩家的余额
async function getPlayerBalance(playerId) {
    let balance = 0
    let playerInfo = await mongodb.findOne('player', { id: playerId })
    if (!playerInfo) {
        throw { err: true, res: '玩家不存在' }
    }
    if (playerInfo.status == 0) {
        throw { err: true, res: '玩家已被冻结' }
    }
    let playerGroupArr = await mongodb.db.collection('playerBill').aggregate([{ $match: { ownerId: playerId } }, { $group: { _id: "$ownerId", count: { $sum: "$amount" } } }]).toArray()
    for (let item of playerGroupArr) {
        if (item._id == playerInfo.id) {
            return item.count
        }
    }
    return balance
}


module.exports = router