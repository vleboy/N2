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
    let targetAmout = Math.abs(inparam.amount)
    let createAt = Date.now()
    let project = inparam.project
    project == Util.ProjectEnum.addPoint ? ownerAmount *= -1 : targetAmout *= -1
    const session = await global.getMongoSession()
    try {
        await mongodb.collection(Util.CollectionEnum.bill).insertMany([
            { id: await Util.getSeq('billSeq'), role: Util.RoleEnum.agent, project, amount: ownerAmount, ownerId: token.id, ownerName: token.userName, ownerNick: token.userNick, parentId: token.parentId, createAt },
            { id: await Util.getSeq('billSeq'), role: inparam.role, project, amount: targetAmout, ownerId: inparam.ownerId, ownerName: inparam.ownerName, ownerNick: inparam.ownerNick, parentId: inparam.parentId, createAt },
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
        let balance = 0
        if (inparam.project == Util.ProjectEnum.addPoint) {
            balance = await Util.getBalanceById(token.id, inparam.role, tokenInfo.lastBalanceTime, tokenInfo.lastBalance)
        } else if (inparam.project == Util.ProjectEnum.reducePoint) {
            balance = await Util.getBalanceById(agentInfo.id, inparam.role, agentInfo.lastBalanceTime, agentInfo.lastBalance)
        } else {
            throw { err: true, res: '未知操作' }
        }
        if (balance < inparam.amount) {
            throw { err: true, res: '余额不足' }
        }
        inparam.ownerName = agentInfo.userName
        inparam.ownerNick = agentInfo.userNick
        inparam.parentId = agentInfo.parentId
    } else if (inparam.role == Util.RoleEnum.player) {
        let player = await mongodb.collection(Util.CollectionEnum.player).findOne({ id: inparam.ownerId })
        if (!player || player.status == 0) {
            throw { err: true, res: '玩家不存在或被停用' }
        }
        if (player.parentId != token.id) {
            throw { err: true, res: '代理只能操作自己的玩家' }
        }
        let balance = 0
        if (inparam.project == Util.ProjectEnum.addPoint) {
            balance = await Util.getBalanceById(token.id, inparam.role, tokenInfo.lastBalanceTime, tokenInfo.lastBalance)
        } else if (inparam.project == Util.ProjectEnum.reducePoint) {
            balance = await Util.getBalanceById(player.id, inparam.role, player.lastBalanceTime, player.lastBalance)
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

module.exports = router