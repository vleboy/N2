const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const _ = require('lodash')
const Util = require('../util/util.js')
const Router = require('koa-router')
const router = new Router()

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
        let player = await mongodb.collection(Util.CollectionEnum.player).findOne({ id: +inparam.userId })
        if (player) {
            res.balance = player.balance
        } else {
            res.code = -1
            res.msg = '玩家不存在'
        }
    } else {
        let balanceRes = await syncBill(inparam, player)
        if (balanceRes.err) {
            res.code = -1
            res.msg = balanceRes.res
        } else {
            res.balance = balanceRes.balance
        }
    }
    ctx.body = res
})

// 私有方法：变更玩家余额，写入玩家流水
async function syncBill(inparam, player) {
    const mongodb = global.mongodb
    const session = await global.getMongoSession()
    // 通过玩家ID查询玩家
    let queryBalance = { id: +inparam.userId }
    // 如果是投注，需要判断余额
    if (inparam.method == 'bet') {
        queryBalance.balance = { $gte: Math.abs(inparam.amount) }
    }
    // 若返还，检查投注存在性
    // if (await mongodb.collection(Util.CollectionEnum.bill).findOne({ sourceId: inparam.sn }, { projection: { id: 1, _id: 0 } })) {
    //     let player = await mongodb.collection(Util.CollectionEnum.player).findOne({ id: +inparam.userId })
    //     if (player) {
    //         return { balance: player.balance }
    //     } else {
    //         return { err: true, res: '玩家不存在' }
    //     }
    // }
    try {
        // 变更玩家余额
        const res = await mongodb.collection(Util.CollectionEnum.player).findOneAndUpdate(queryBalance, { $inc: { balance: inparam.amount } }, { returnOriginal: false, projection: { balance: 1, _id: 0 }, session })
        // 写入流水
        if (res.value) {
            let createAt = Date.now()
            await mongodb.collection(Util.CollectionEnum.bill).insertOne({
                id: await Util.getSeq('billSeq'),
                role: Util.RoleEnum.player,
                project: inparam.method,
                preBalance: NP.minus(res.value.balance, inparam.amount),
                amount: inparam.amount,
                balance: res.value.balance,

                ownerId: player.id,
                ownerName: player.playerName,
                ownerNick: player.playerNick,
                parentId: player.parentId,
                parentName: player.parentName,
                parentNick: player.parentNick,

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
            return ctx.body = { err: true, res: '余额不足' }
        }
        await session.commitTransaction()
        return { balance: res.value.balance }
    } catch (error) {
        console.error(error)
        await session.abortTransaction()
        return ctx.body = { err: true, res: '服务异常' }
    } finally {
        await session.endSession()
    }
}
module.exports = router