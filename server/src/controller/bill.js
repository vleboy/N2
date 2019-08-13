const Router = require('koa-router')
const router = new Router()
const Util = require('../util/util.js')
const NP = require('number-precision')
const moment = require('moment')

/**
 * 代理之间的转账接口
 * （代理给下级代理转账，代理给玩家转账）
 */
router.post('/transfer', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (!inparam.id || !inparam.amount || !inparam.project || !inparam.role) {
        return ctx.body = { err: true, res: '请检查入参' }
    }
    inparam.project = inparam.project == 1 ? Util.ProjectEnum.TransferIn : Util.ProjectEnum.TransferOut
    const collectionName = inparam.role == Util.RoleEnum.agent ? Util.CollectionEnum.agent : Util.CollectionEnum.player
    // 检查代理或玩家是否可以进行转账操作
    let [owner, target] = await checkTransfer(inparam, token)
    let ownerAmount = Math.abs(inparam.amount)
    let ownerQuery = { id: token.id }
    let ownerProject = Util.ProjectEnum.TransferOut
    let ownerPreBalance = 0
    let ownerBalance = 0
    let targetAmout = Math.abs(inparam.amount)
    let targetProject = inparam.project
    let targetQuery = { id: inparam.id }
    let targetPreBalance = 0
    let targetBalance = 0
    let ownerBillId = 0
    let targetBillId = 0
    let createAt = Date.now()
    let ownerCreateAt = createAt
    let targetCreateAt = createAt
    if (inparam.project == Util.ProjectEnum.TransferIn) {
        ownerAmount *= -1
        ownerQuery.balance = { $gte: Math.abs(inparam.amount) }
        ownerBillId = await Util.getSeq('billSeq')
        targetBillId = await Util.getSeq('billSeq')
        targetCreateAt += 1
    } else {
        ownerProject = Util.ProjectEnum.TransferIn
        targetAmout *= -1
        targetQuery.balance = { $gte: Math.abs(inparam.amount) }
        targetBillId = await Util.getSeq('billSeq')
        ownerBillId = await Util.getSeq('billSeq')
        ownerCreateAt += 1
    }
    const session = await global.getMongoSession()
    try {
        let res0, res1 = {}
        // TODO 玩家点数与N1同步
        // 变更余额
        if (inparam.project == Util.ProjectEnum.TransferIn) {
            res0 = await global.mongodb.collection(Util.CollectionEnum.agent).findOneAndUpdate(ownerQuery, { $inc: { balance: ownerAmount } }, { returnOriginal: false, projection: { balance: 1, _id: 0 }, session })
            if (res0.value.balance) {
                ownerBalance = res0.value.balance
                ownerPreBalance = NP.minus(ownerBalance, ownerAmount)
                res1 = await global.mongodb.collection(collectionName).findOneAndUpdate(targetQuery, { $inc: { balance: targetAmout } }, { returnOriginal: false, projection: { balance: 1, _id: 0 }, session })
                targetBalance = res1.value.balance
                targetBalance = NP.minus(targetBalance, targetAmout)
            }
        } else {
            res0 = await global.mongodb.collection(collectionName).findOneAndUpdate(targetQuery, { $inc: { balance: targetAmout } }, { returnOriginal: false, projection: { balance: 1, _id: 0 }, session })
            if (res0.value.balance) {
                targetBalance = res0.value.balance
                targetBalance = NP.minus(targetBalance, targetAmout)
                res1 = await global.mongodb.collection(Util.CollectionEnum.agent).findOneAndUpdate(ownerQuery, { $inc: { balance: ownerAmount } }, { returnOriginal: false, projection: { balance: 1, _id: 0 }, session })
                ownerBalance = res1.value.balance
                ownerPreBalance = NP.minus(ownerBalance, ownerAmount)
            }
        }
        // 写入流水
        if (res0.value.balance) {
            await mongodb.collection(Util.CollectionEnum.bill).insertOne({
                id: ownerBillId,
                role: Util.RoleEnum.agent,
                project: ownerProject,
                preBalance: ownerPreBalance,
                amount: ownerAmount,
                balance: ownerBalance,
                ownerId: owner.id,
                ownerName: owner.userName,
                ownerNick: owner.userNick,
                parentId: owner.parentId,
                parentName: owner.parentName,
                parentNick: owner.parentNick,
                createAt: ownerCreateAt,
                createAtStr: moment(ownerCreateAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
            }, { session })
            await mongodb.collection(Util.CollectionEnum.bill).insertOne({
                id: targetBillId,
                role: inparam.role,
                project: targetProject,
                preBalance: targetPreBalance,
                amount: targetAmout,
                balance: targetBalance,
                ownerId: target.id,
                ownerName: target.targetName,
                ownerNick: target.targetNick,
                parentId: target.parentId,
                parentName: target.parentName,
                parentNick: target.parentNick,
                createAt: targetCreateAt,
                createAtStr: moment(targetCreateAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
            }, { session })
        } else {
            return ctx.body = { err: true, res: '余额不足' }
        }
        await session.commitTransaction()
    } catch (error) {
        console.error(error)
        await session.abortTransaction()
        return ctx.body = { err: true, res: '操作失败，请稍后再试' }
    } finally {
        await session.endSession()
    }
    ctx.body = { err: false, msg: '操作成功' }
})

//检查用户是否可以转账
async function checkTransfer(inparam, token) {
    let owner = await mongodb.collection(Util.CollectionEnum.agent).findOne({ id: token.id })
    if (!owner || owner.status == Util.StatusEnum.Disable) {
        throw { err: true, res: '帐号不存在或被停用' }
    }
    const collectionName = inparam.role == Util.RoleEnum.agent ? Util.CollectionEnum.agent : Util.CollectionEnum.player
    let target = await mongodb.collection(collectionName).findOne({ id: inparam.id })
    if (!target || target.status == Util.StatusEnum.Disable) {
        throw { err: true, res: '帐号不存在或被停用' }
    }
    if (target.parentId != owner.id) {
        throw { err: true, res: '禁止非直属转账' }
    }
    let id = target.id
    let targetName = target.userName
    let targetNick = target.userNick
    let parentId = target.parentId
    let parentName = target.parentName
    let parentNick = target.parentNick
    if (target.role == Util.RoleEnum.player) {
        targetName = target.playerName
        targetNick = target.playerNick
    }
    return [owner, { id, targetName, targetNick, parentId, parentName, parentNick }]
}

module.exports = router