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
    // 预置返回对象
    let res = { code: 0, msg: '', balance: 0 }
    // 查询对应玩家
    if (inparam.method == 'auth') {
        let player = await mongodb.collection(Util.CollectionEnum.player).findOne({ id: +inparam.userId }, { projection: { balance: 1, playerNick: 1, _id: 0 } })
        if (player) {
            res.balance = player.balance
            res.userNick = player.playerNick
        } else {
            res.code = -2
            res.msg = '玩家不存在'
        }
    } else {
        let balanceRes = await syncBill(inparam)
        if (balanceRes.err) {
            res.code = balanceRes.err
            res.msg = balanceRes.res
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
                    console.log(Date.now() - RetMap[inparam.sn])
                    return { err: false, res: '确认无下注记录', balance: player.balance }
                } else {
                    return { err: -1, res: '无下注记录', balance: player.balance }
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
        const res = await mongodb.collection(Util.CollectionEnum.player).findOneAndUpdate(queryBalance, { $inc: { balance: inparam.amount } }, { returnOriginal: false, projection: { id: 1, playerName: 1, playerNick: 1, parentId: 1, parentName: 1, parentNick: 1, balance: 1, _id: 0 }, session })
        // 写入流水
        if (res.value || res.value == 0) {
            let createAt = Date.now()
            await mongodb.collection(Util.CollectionEnum.bill).insertOne({
                id: await Util.getSeq('billSeq'),
                role: Util.RoleEnum.player,
                project: inparam.method,
                preBalance: NP.minus(res.value.balance, inparam.amount),
                amount: inparam.amount,
                balance: res.value.balance,

                ownerId: res.value.id,
                ownerName: res.value.playerName,
                ownerNick: res.value.playerNick,
                parentId: res.value.parentId,
                parentName: res.value.parentName,
                parentNick: res.value.parentNick,

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
            if (player && player.status == Util.StatusEnum.Enable) {
                return { err: -2, res: '余额不足', balance: player.balance }
            }
            if (player && player.status != Util.StatusEnum.Enable) {
                return { err: -2, res: '玩家已停用', balance: player.balance }
            }
            if (!player) {
                return { err: -2, res: '玩家不存在' }
            }
        }
        await session.commitTransaction()
        return { balance: res.value.balance }
    } catch (error) {
        console.error(error)

        await session.abortTransaction()
        if (error.errmsg && error.errmsg.indexOf('sourceId_1') != -1) {
            let player = await mongodb.collection(Util.CollectionEnum.player).findOne({ id: +inparam.userId }, { projection: { balance: 1, _id: 0 } })
            return { err: false, res: '重复流水', balance: player.balance }
        }
        return { err: -1, res: '服务异常' }
    } finally {
        await session.endSession()
    }
}
module.exports = router