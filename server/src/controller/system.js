//路由相关
const Router = require('koa-router')
const router = new Router()

//工具
const _ = require('lodash')

/**
 * 审核充值/提现接口
 */
router.post('/handlerReview', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (!inparam.id) {
        return ctx.body = { err: true, res: '请检查id' }
    }
    let reviewInfo = await mongodb.findOne('review', { id: inparam.id })
    if (!reviewInfo) {
        return ctx.body = { err: true, res: '订单不存在' }
    }
    if (reviewInfo.status == 1) {
        return ctx.body = { err: true, res: '订单已处理' }
    }
    //下面应该用事务做（暂时写流程）
    let agentItem = {
        billId: _.random(99999999),
        ownerId: token.id,
        ownerName: token.userName,
        createAt: Date.now()
    }
    let playerItem = {
        billId: _.random(99999999),
        ownerId: reviewInfo.proposerId,
        ownerName: reviewInfo.proposerName,
        createAt: Date.now()
    }
    if (reviewInfo.project == '充值') {
        //判断代理是否有钱扣
        let balance = await getAgentBalance(token.id)
        if (balance != 'system' && balance < reviewInfo.amount) {
            return ctx.body = { err: true, res: '代理余额不足' }
        }
        //代理新增扣钱流水
        agentItem.project = '减点'
        agentItem.amount = Math.abs(reviewInfo.amount) * -1
        await mongodb.insert('agentBill', agentItem)
        //玩家新增加钱流水
        playerItem.project = '加点'
        playerItem.amount = Math.abs(reviewInfo.amount)
        await mongodb.insert('playerBill', playerItem)
    } else if (reviewInfo.project == '提现') {
        //判断玩家余额是否足够
        let balance = await getPlayerBalance(reviewInfo.proposerId)
        if (balance < reviewInfo.amount) {
            return ctx.body = { err: true, res: '玩家余额不足' }
        }
        //玩家提现代理不加点只有玩家减点记录
        playerItem.project = '减点'
        playerItem.amount = Math.abs(reviewInfo.amount) * -1
        await mongodb.insert('playerBill', playerItem)
    }
    // 更新审核条件
    let updateItem = {
        status: 1,
        reviewerId: token.id,
        reviewerName: token.userName,
        reviewAt: Date.now()
    }
    let result = await mongodb.update('review', { id: inparam.id }, { $set: updateItem })
    ctx.body = { err: false, res: result.result.nModified.toString() }
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