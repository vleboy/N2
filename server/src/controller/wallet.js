const config = require('config')
// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
const _ = require('lodash')
const moment = require('moment')
const NP = require('number-precision')
const Util = require('../util/util.js')
const Router = require('koa-router')
const router = new Router()
// 存储无下注记录
const RetMap = {}

/**
 * 免转钱包接口
 */
router.post('/transfer', async (ctx, next) => {
    const inparam = ctx.request.body
    const mongodb = global.mongodb
    let res = { code: 0, msg: '', balance: 0 }
    // auth
    if (inparam.method == 'auth') {
        let player = await mongodb.collection(Util.CollectionEnum.player).findOne({ id: +inparam.userId }, { projection: { balance: 1, playerNick: 1, _id: 0 } })
        if (player) {
            mongodb.collection(Util.CollectionEnum.player).updateOne({ id: inparam.userId }, { $set: { lastAuthAt: Date.now() } })
            res.balance = +player.balance.toFixed(2)
            res.userNick = player.playerNick
        } else {
            res = { code: -2, msg: '玩家不存在', balance: 0 }
        }
    }
    // bet/win/refund 
    else {
        let balanceRes = await syncBill(inparam)
        if (balanceRes.err) {
            res = { code: balanceRes.err, msg: balanceRes.res, balance: 0 }
        } else {
            res.balance = balanceRes.balance
        }
    }
    ctx.body = res
})

// 私有方法：变更玩家余额，写入玩家流水
async function syncBill(inparam) {
    const mongodb = global.mongodb
    // 通过玩家ID查询玩家
    let queryBalance = { id: +inparam.userId }
    // 如果是投注，需要判断余额
    if (inparam.method == Util.ProjectEnum.Bet) {
        queryBalance.balance = { $gte: Math.abs(inparam.amount) }
        queryBalance.status = Util.StatusEnum.Enable
    }
    // 若返还，检查投注存在性
    else {
        let betquery = { sourceId: inparam.betsn }
        if (!inparam.betsn) {
            betquery = { sourceRelKey: inparam.businessKey, project: Util.ProjectEnum.Bet }
        }
        if (!await mongodb.collection(Util.CollectionEnum.bill).findOne(betquery, { projection: { id: 1, _id: 0 } })) {
            let player = await mongodb.collection(Util.CollectionEnum.player).findOne({ id: +inparam.userId }, { projection: { balance: 1, _id: 0 } })
            if (player) {
                if (!RetMap[inparam.sn]) {
                    RetMap[inparam.sn] = inparam.timestamp
                }
                if (Date.now() - RetMap[inparam.sn] > 30 * 60 * 1000) {
                    return { err: false, res: '确认无下注记录', balance: +player.balance.toFixed(2) }
                } else {
                    return { err: -1, res: '无下注记录', balance: +player.balance.toFixed(2) }
                }
            } else {
                return { err: -2, res: '玩家不存在' }
            }
        }
    }
    // 开启事务
    const session = await global.getMongoSession()
    try {
        // 变更玩家余额
        const res = await mongodb.collection(Util.CollectionEnum.player).findOneAndUpdate(queryBalance, { $inc: { balance: inparam.amount } }, { returnOriginal: true, projection: { id: 1, playerName: 1, playerNick: 1, parentId: 1, parentName: 1, parentNick: 1, balance: 1, _id: 0 }, session })
        // 写入流水
        if (res.value) {
            let createAt = Date.now()
            await mongodb.collection(Util.CollectionEnum.bill).insertOne({
                id: await Util.getSeq('billSeq'),
                role: Util.RoleEnum.player,
                project: inparam.method,
                preBalance: +res.value.balance.toFixed(2),
                amount: inparam.amount,
                balance: NP.plus(+res.value.balance.toFixed(2), inparam.amount),

                ownerId: res.value.id,
                ownerName: res.value.playerName,
                ownerNick: res.value.playerNick,
                parentId: res.value.parentId,
                parentName: res.value.parentName,
                parentNick: res.value.parentNick,

                sourceIP: inparam.sourceIP,
                sourceGameId: inparam.gameId,
                sourceId: inparam.sn,
                sourceRelKey: inparam.businessKey,
                sourceDetail: inparam.detail,
                sourceTimestamp: inparam.timestamp,
                sourceTimestampStr: moment(inparam.timestamp).utcOffset(8).format('YYYY-MM-DD HH:mm:ss'),

                createAt,
                createAtStr: moment(createAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
            }, { session })
        } else {
            let player = await mongodb.collection(Util.CollectionEnum.player).findOne({ id: +inparam.userId }, { projection: { balance: 1, status: 1, _id: 0 } })
            if (!player) {
                return { err: -2, res: '玩家不存在' }
            }
            // 投注检查返回错误
            if (player.status == Util.StatusEnum.Enable) {
                return { err: -2, res: '余额不足', balance: +player.balance.toFixed(2) }
            }
            if (player.status != Util.StatusEnum.Enable) {
                return { err: -2, res: '玩家已停用', balance: +player.balance.toFixed(2) }
            }
        }
        await session.commitTransaction()
        return { balance: NP.plus(+res.value.balance.toFixed(2), inparam.amount) }
    } catch (error) {
        console.error(error)
        await session.abortTransaction()
        if (error.errmsg && error.errmsg.indexOf('sourceId_1') != -1) {
            let player = await mongodb.collection(Util.CollectionEnum.player).findOne({ id: +inparam.userId }, { projection: { balance: 1, _id: 0 } })
            return { err: false, res: '重复流水', balance: +player.balance.toFixed(2) }
        }
        return { err: -1, res: '服务异常' }
    } finally {
        await session.endSession()
    }
}
module.exports = router