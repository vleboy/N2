//路由相关
const Router = require('koa-router')
const router = new Router()

//工具
const _ = require('lodash')
const { ProjectEnum, RoleEnum, CollectionEnum } = require('../util/util')

//创建管理员
router.post('/create', async (ctx, next) => {
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    // 入参检查
    if (!inparam.userName || !inparam.userPwd || !inparam.userNick) {
        ctx.body = { err: true, res: '请检查入参' }
    }
    if (await mongodb.collection('agent').findOne({ $or: [{ userName: inparam.userName }, { userNick: inparam.userNick }] })) {
        ctx.body = { err: true, res: '帐号/昵称已存在' }
    }
    let flag = true
    while (flag) {
        inparam.id = _.random(100000, 999999)
        if (!await mongodb.collection('agent').findOne({ id: inparam.id })) {
            flag = false
        }
    }
    inparam.status = 1
    inparam.role = 'admin'
    inparam.createAt = Date.now()
    let result = await mongodb.collection('agent').insertOne(inparam)
    ctx.body = { err: false, res: result.insertedId }
})

/**
 * 管理员可直接对（代理/玩家）进行(充值/提现)操作
 */
router.post('/handlerPoint', async (ctx, next) => {
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (!inparam.id || !inparam.project || !inparam.role || !inparam.amount) {
        return ctx.body = { err: true, res: '请检查入参' }
    }
    // 检查代理/玩家是否满足操作条件
    await checkUserHandlerPoint(inparam)
    // 加点操作
    if (inparam.project == ProjectEnum.addPoint) {
        // 给代理加点
        if (inparam.role == RoleEnum.agent) {
            await mongodb.collection(CollectionEnum.agentBill).insertOne({ billId: _.random(99999999), project: inparam.project, amount: Math.abs(inparam.amount), ownerId: inparam.id, ownerName: inparam.ownerName, createAt: Date.now() })
        }
        // 给玩家加点
        if (inparam.role == RoleEnum.player) {
            await mongodb.collection(CollectionEnum.playerBill).insertOne({ billId: _.random(99999999), project: inparam.project, amount: Math.abs(inparam.amount), ownerId: inparam.id, ownerName: inparam.ownerName, createAt: Date.now() })
        }
    }
    // 减点操作
    else if (inparam.project == ProjectEnum.reducePoint) {
        // 给代理减点
        if (inparam.role == RoleEnum.agent) {
            await mongodb.collection(CollectionEnum.agentBill).insertOne({ billId: _.random(99999999), project: inparam.project, amount: Math.abs(inparam.amount) * -1, ownerId: inparam.id, ownerName: inparam.ownerName, createAt: Date.now() })
        }
        // 给玩家减点
        if (inparam.role == RoleEnum.player) {
            await mongodb.collection(CollectionEnum.playerBill).insertOne({ billId: _.random(99999999), project: inparam.project, amount: Math.abs(inparam.amount) * -1, ownerId: inparam.id, ownerName: inparam.ownerName, createAt: Date.now() })
        }
    } else {
        return ctx.body = { err: true, res: '未知操作' }
    }
    ctx.body = { err: false, res: '操作成功' }
})


//检查用户是否可以转账
async function checkUserHandlerPoint(inparam) {
    if (inparam.role == RoleEnum.agent) {
        let agentInfo = await mongodb.collection(CollectionEnum.agent).findOne({ id: inparam.id })
        if (!agentInfo || agentInfo.status == 0) {
            throw { err: true, res: '代理不存在或被停用' }
        }
        if (inparam.project == ProjectEnum.reducePoint) {
            let balance = await getAgentBalance(agentInfo.id)
            if (balance < inparam.amount) {
                throw { err: true, res: '代理余额不足' }
            }
        }
        inparam.ownerName = agentInfo.userName
    } else if (inparam.role == RoleEnum.player) {
        let player = await mongodb.collection(CollectionEnum.player).findOne({ id: inparam.id })
        if (!player || player.status == 0) {
            throw { err: true, res: '玩家不存在或被停用' }
        }
        if (inparam.project == ProjectEnum.reducePoint) {
            let balance = await getPlayerBalance(player.id)
            if (balance < inparam.amount) {
                throw { err: true, res: '玩家余额不足' }
            }
        }
        inparam.ownerName = player.playerName
    } else {
        throw { err: true, res: '非法角色' }
    }
}


//获取代理的余额
async function getAgentBalance(agentId) {
    let balance = 0
    let agentGroupArr = await mongodb.collection(CollectionEnum.agentBill).aggregate([{ $match: { ownerId: agentId } }, { $group: { _id: "$ownerId", count: { $sum: "$amount" } } }]).toArray()
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
    let playerGroupArr = await mongodb.collection(CollectionEnum.playerBill).aggregate([{ $match: { ownerId: playerId } }, { $group: { _id: "$ownerId", count: { $sum: "$amount" } } }]).toArray()
    for (let item of playerGroupArr) {
        if (item._id == playerInfo.id) {
            return item.count
        }
    }
    return balance
}

module.exports = router