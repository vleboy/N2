const Router = require('koa-router')
const router = new Router()
const Util = require('../util/util.js')

/**
 * 代理之间的转账接口
 * （代理给下级代理转账，代理给玩家转账）
 */
router.post('/transfer', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (!inparam.ownerId || !inparam.amount || !inparam.project || !inparam.role) {
        return ctx.body = { err: true, res: '请检查入参' }
    }
    // 检查代理或玩家是否可以进行转账操作
    await checkAgentHandlerPoint(inparam, token)
    let ownerAmount = Math.abs(inparam.amount)
    let ownerQuery = { id: token.id }
    let ownerProject = Util.ProjectEnum.reducePoint
    let ownerPreBalance = 0
    let ownerBalance = 0
    let targetAmout = Math.abs(inparam.amount)
    let targetProject = Util.ProjectEnum.addPoint
    let targetQuery = { id: inparam.ownerId }
    let targetPreBalance = 0
    let targetBalance = 0

    if (inparam.project == Util.ProjectEnum.addPoint) {
        targetProject = Util.ProjectEnum.reducePoint
        ownerAmount *= -1
        ownerQuery.balance = { $gte: Math.abs(inparam.amount) }
    } else {
        ownerProject = Util.ProjectEnum.addPoint
        targetAmout *= -1
        targetQuery.balance = { $gte: Math.abs(inparam.amount) }
    }
    const session = await global.getMongoSession()
    try {
        let res0, res1 = {}
        // 变更余额
        if (inparam.project == Util.ProjectEnum.addPoint) {
            res0 = await global.mongodb.collection(collectionName).findOneAndUpdate(ownerQuery, { $inc: { balance: ownerAmount } }, { returnOriginal: false, projection: { balance: 1, _id: 0 }, session })
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
                res1 = await global.mongodb.collection(collectionName).findOneAndUpdate(ownerQuery, { $inc: { balance: ownerAmount } }, { returnOriginal: false, projection: { balance: 1, _id: 0 }, session })
                ownerBalance = res1.value.balance
                ownerPreBalance = NP.minus(ownerBalance, ownerAmount)
            }
        }
        // 写入流水
        if (res0.value.balance) {
            let createAt = Date.now()
            await mongodb.collection(Util.CollectionEnum.bill).insertMany([
                {
                    id: await Util.getSeq('billSeq'),
                    role: Util.RoleEnum.agent,
                    project: ownerProject,
                    preBalance: ownerPreBalance,
                    amount: ownerAmount,
                    balance: ownerBalance,
                    ownerId: token.id,
                    ownerName: token.userName,
                    ownerNick: token.userNick,
                    parentId: token.parentId,
                    parentName: inparam.parentName,
                    parentNick: inparam.parentNick,
                    createAt
                },
                {
                    id: await Util.getSeq('billSeq'),
                    role: inparam.role,
                    project: targetProject,
                    preBalance: targetPreBalance,
                    amount: targetAmout,
                    balance: targetBalance,
                    ownerId: inparam.ownerId,
                    ownerName: inparam.ownerName,
                    ownerNick: inparam.ownerNick,
                    parentId: inparam.parentId,
                    parentName: inparam.parentName,
                    parentNick: inparam.parentNick,
                    createAt
                },
                { session }
            ])
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
async function checkAgentHandlerPoint(inparam, token) {
    let tokenInfo = await mongodb.collection(Util.CollectionEnum.agent).findOne({ id: token.id })
    if (!tokenInfo || tokenInfo.status == Util.StatusEnum.Disable) {
        throw { err: true, res: '代理不存在或被停用' }
    }
    if (inparam.role == Util.RoleEnum.agent) {
        let agentInfo = await mongodb.collection(Util.CollectionEnum.agent).findOne({ id: inparam.ownerId })
        if (!agentInfo || agentInfo.status == Util.StatusEnum.Disable) {
            throw { err: true, res: '代理不存在或被停用' }
        }
        if (token.id != agentInfo.parentId) {
            throw { err: true, res: '不能跨级操作' }
        }
        inparam.ownerName = agentInfo.userName
        inparam.ownerNick = agentInfo.userNick
        inparam.parentId = agentInfo.parentId
        inparam.parentName = agentInfo.parentName
        inparam.parentNick = agentInfo.parentNick
    } else if (inparam.role == Util.RoleEnum.player) {
        let player = await mongodb.collection(Util.CollectionEnum.player).findOne({ id: inparam.ownerId })
        if (!player || player.status == 0) {
            throw { err: true, res: '玩家不存在或被停用' }
        }
        if (player.parentId != token.id) {
            throw { err: true, res: '代理只能操作自己的玩家' }
        }
        inparam.ownerName = player.playerName
        inparam.ownerNick = player.playerNick
        inparam.parentId = player.parentId
        inparam.parentName = player.parentName
        inparam.parentNick = player.parentNick
    } else {
        throw { err: true, res: '非法角色' }
    }
}

module.exports = router