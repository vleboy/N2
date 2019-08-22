const _ = require('lodash')
const moment = require('moment')
const NP = require('number-precision')
const Util = require('../util/util.js')
const Router = require('koa-router')
const router = new Router()

/**
 * 变更发放状态
 */
router.post('/update', async (ctx, next) => {
    const token = ctx.tokenVerify
    const inparam = ctx.request.body
    const mongodb = global.mongodb
    if (!inparam.id || inparam.status != Util.ReviewEnum.Agree) {
        return ctx.body = { err: true, res: '请检查入参' }
    }
    let profitInfo = await mongodb.collection(Util.CollectionEnum.profit).findOne({ id: inparam.id })
    if (!profitInfo || profitInfo.status != Util.ReviewEnum.Process) {
        return ctx.body = { err: true, res: '订单不存在或已处理' }
    }
    // 检查代理或玩家是否正常
    const collectionName = profitInfo.role == Util.RoleEnum.agent ? Util.CollectionEnum.agent : Util.CollectionEnum.player
    const owner = await Util.checkHandlerPoint({ id: profitInfo.ownerId, role: profitInfo.role })
    let createAt = Date.now()
    //通过该订单
    const session = await global.getMongoSession()
    try {
        // 变更余额
        const res = await global.mongodb.collection(collectionName).findOneAndUpdate({ id: profitInfo.ownerId }, { $inc: { balance: Math.abs(profitInfo.currentProfit) } }, { returnOriginal: false, projection: { balance: 1, _id: 0 }, session })
        // 写入流水，更新发放单为同意状态
        const billId = await Util.getSeq('billSeq')
        await mongodb.collection(Util.CollectionEnum.bill).insertOne({
            id: billId,
            role: profitInfo.role,
            project: Util.ProjectEnum.Profit,
            preBalance: NP.minus(res.value.balance, Math.abs(profitInfo.currentProfit)),
            amount:  Math.abs(profitInfo.currentProfit),
            balance: res.value.balance,
            ownerId: owner.id,
            ownerName: owner.ownerName,
            ownerNick: owner.ownerNick,
            parentId: owner.parentId,
            parentName: owner.parentName,
            parentNick: owner.parentNick,
            createAt,
            createAtStr: moment(createAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
        }, { session })
        await mongodb.collection(Util.CollectionEnum.profit).update({ id: profitInfo.id }, { $set: { billId, status: inparam.status, profitId: token.id, profitName: token.userName, profitNick: token.userNick, profitAt: createAt, profitAtStr: moment(createAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss') } }, { session })
        await session.commitTransaction()
    } catch (error) {
        console.error(error)
        await session.abortTransaction()
        return ctx.body = { err: true, res: '操作失败，请稍后再试' }
    } finally {
        await session.endSession()
    }
    ctx.body = { err: false, res: '操作成功' }
})


module.exports = router