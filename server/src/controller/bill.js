const config = require('config')
const jwt = require('jsonwebtoken')
const Router = require('koa-router')
const router = new Router()

const { ProjectEnum, RoleEnum, CollectionEnum, GetUniqueID } = require('../util/util')

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
    let targetAmout = Math.abs(inparam.amount)
    let createAt = Date.now()
    let project = inparam.project
    project == ProjectEnum.addPoint ? ownerAmount *= -1 : targetAmout *= -1
    const session = await global.getMongoSession()
    try {
        await mongodb.collection(CollectionEnum.bill).insertMany([
            { id: GetUniqueID(), role: RoleEnum.agent, project, amount: ownerAmount, ownerId: token.id, ownerName: token.userName, ownerNick: token.userNick, parentId: token.parentId, createAt },
            { id: GetUniqueID(), role: inparam.role, project, amount: targetAmout, ownerId: inparam.ownerId, ownerName: inparam.ownerName, ownerNick: inparam.ownerNick, parentId: inparam.parentId, createAt },
            { session }
        ])
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
    if (inparam.role == RoleEnum.agent) {
        let agentInfo = await mongodb.collection(CollectionEnum.agent).findOne({ id: inparam.ownerId })
        if (!agentInfo || agentInfo.status == 0) {
            throw { err: true, res: '代理不存在或被停用' }
        }
        if (token.id != agentInfo.parentId) {
            throw { err: true, res: '不能跨级操作' }
        }
        let balance = 0
        if (inparam.project == ProjectEnum.addPoint) {
            balance = await getAgentBalance(token.id)
        } else if (inparam.project == ProjectEnum.reducePoint) {
            balance = await getAgentBalance(agentInfo.id)
        } else {
            throw { err: true, res: '未知操作' }
        }
        if (balance < inparam.amount) {
            throw { err: true, res: '余额不足' }
        }
        inparam.ownerName = agentInfo.userName
        inparam.ownerNick = agentInfo.userNick
        inparam.parentId = agentInfo.parentId
    } else if (inparam.role == RoleEnum.player) {
        let player = await mongodb.collection(CollectionEnum.player).findOne({ id: inparam.ownerId })
        if (!player || player.status == 0) {
            throw { err: true, res: '玩家不存在或被停用' }
        }
        if (player.parentId != token.id) {
            throw { err: true, res: '代理只能操作自己的玩家' }
        }
        let balance = 0
        if (inparam.project == ProjectEnum.addPoint) {
            balance = await getAgentBalance(token.id)
        } else if (inparam.project == ProjectEnum.reducePoint) {
            balance = await getPlayerBalance(player.id)
        } else {
            throw { err: true, res: '未知操作' }
        }
        if (balance < inparam.amount) {
            throw { err: true, res: '余额不足' }
        }
        inparam.ownerName = player.playerName
        inparam.ownerNick = player.playerNick
        inparam.parentId = player.parentId
    } else {
        throw { err: true, res: '非法角色' }
    }
}

//获取代理的余额
async function getAgentBalance(agentId) {
    let balance = 0
    let agentGroupArr = await mongodb.collection(CollectionEnum.bill).aggregate([{ $match: { ownerId: agentId } }, { $group: { _id: "$ownerId", count: { $sum: "$amount" } } }]).toArray()
    for (let item of agentGroupArr) {
        if (item._id == agentId) {
            balance = item.count
            return balance
        }
    }
    return balance
}
//获取玩家的余额
async function getPlayerBalance(playerId) {
    let balance = 0
    let playerGroupArr = await mongodb.collection(CollectionEnum.bill).aggregate([{ $match: { ownerId: playerId } }, { $group: { _id: "$ownerId", count: { $sum: "$amount" } } }]).toArray()
    for (let item of playerGroupArr) {
        if (item._id == playerId) {
            return item.count
        }
    }
    return balance
}

module.exports = router