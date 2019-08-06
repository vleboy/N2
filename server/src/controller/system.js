//路由相关
const Router = require('koa-router')
const router = new Router()

//工具
const _ = require('lodash')
const {ProjectEnum}=require('../util/util')

/**
 * 审核（充值/提现）接口（来源于申请单可以是代理或者玩家）
 */
router.post('/handlerReview', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (!inparam.id) {
        return ctx.body = { err: true, res: '请检查id' }
    }
    let reviewInfo = await mongodb.collection('review').findOne({ id: inparam.id })
    if (!reviewInfo) {
        return ctx.body = { err: true, res: '订单不存在' }
    }
    if (reviewInfo.status == 1) {
        return ctx.body = { err: true, res: '订单已处理' }
    }
    if (reviewInfo.project == ProjectEnum.addPoint) {
        if (reviewInfo.role == 'agent') {
            let agentInfo = await mongodb.collection('agent').findOne( { id: reviewInfo.proposerId })
            if (!agentInfo) {
                return ctx.body = { err: true, res: '代理不存在' }
            }
            await mongodb.collection('agentBill').insertOne( { billId: _.random(99999999), project: reviewInfo.project, amount: Math.abs(reviewInfo.amount), ownerId: agentInfo.id, ownerName: agentInfo.userName, createAt: Date.now() })
        } else if (reviewInfo.role == 'player') {
            let player = await mongodb.collection('player').findOne( { id: reviewInfo.proposerId })
            if (!player) {
                return ctx.body = { err: true, res: '玩家不存在' }
            }
            await mongodb.collection('playerBill').insertOne({ billId: _.random(99999999), project: reviewInfo.project, amount: Math.abs(reviewInfo.amount), ownerId: player.id, ownerName: player.userName, createAt: Date.now() })
        }
    } else if (reviewInfo.project == ProjectEnum.reducePoint) {
        if (reviewInfo.role == 'agent') {
            let agentInfo = await mongodb.collection('agent').findOne({ id: reviewInfo.proposerId })
            if (!agentInfo) {
                return ctx.body = { err: true, res: '代理不存在' }
            }
            await mongodb.collection('agentBill').insertOne( { billId: _.random(99999999), project: reviewInfo.project, amount: Math.abs(reviewInfo.amount) * -1, ownerId: agentInfo.id, ownerName: agentInfo.userName, createAt: Date.now() })
        } else if (reviewInfo.role == 'player') {
            let player = await mongodb.collection('player').findOne( { id: reviewInfo.proposerId })
            if (!player) {
                return ctx.body = { err: true, res: '玩家不存在' }
            }
            await mongodb.collection('playerBill').insertOne( { billId: _.random(99999999), project: reviewInfo.project, amount: Math.abs(reviewInfo.amount) * -1, ownerId: player.id, ownerName: player.userName, createAt: Date.now() })
        }
    }
    // 更新审核条件
    let updateItem = {
        status: 1,
        reviewerId: token.id,
        reviewerName: token.userName,
        reviewAt: Date.now()
    }
    let result = await mongodb.collection('review').updateOne({ id: inparam.id }, { $set: updateItem })
    ctx.body = { err: false, res: result.result.nModified.toString() }
})

//获取代理的余额
async function getAgentBalance(agentId) {
    let balance = 0
    let agentInfo = await mongodb.collection('agent').findOne({ id: agentId })
    if (!agentInfo || agentInfo.status == 0) {
        throw { err: true, res: '代理不存在或被冻结' }
    }
    let agentGroupArr = await mongodb.collection('agentBill').aggregate([{ $match: { ownerId: agentId } }, { $group: { _id: "$ownerId", count: { $sum: "$amount" } } }]).toArray()
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
    let playerInfo = await mongodb.collection('player').findOne({ id: playerId })
    if (!playerInfo) {
        throw { err: true, res: '玩家不存在' }
    }
    if (playerInfo.status == 0) {
        throw { err: true, res: '玩家已被冻结' }
    }
    let playerGroupArr = await mongodb.collection('playerBill').aggregate([{ $match: { ownerId: playerId } }, { $group: { _id: "$ownerId", count: { $sum: "$amount" } } }]).toArray()
    for (let item of playerGroupArr) {
        if (item._id == playerInfo.id) {
            return item.count
        }
    }
    return balance
}

module.exports = router