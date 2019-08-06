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

/**
 * 管理员 审核（充值/提现）申请单
 * （申请单来源于可以是代理或者玩家）
 */
router.post('/handlerReview', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (!inparam.id) {
        return ctx.body = { err: true, res: '请检查id' }
    }
    let reviewInfo = await mongodb.collection(CollectionEnum.review).findOne({ id: inparam.id })
    if (!reviewInfo) {
        return ctx.body = { err: true, res: '订单不存在' }
    }
    if (reviewInfo.status == 1) {
        return ctx.body = { err: true, res: '订单已处理' }
    }
    //检查订单是否
    if (reviewInfo.project == ProjectEnum.addPoint) {
        if (reviewInfo.role == RoleEnum.agent) {
            let agentInfo = await mongodb.collection('agent').findOne({ id: reviewInfo.proposerId })
            if (!agentInfo) {
                return ctx.body = { err: true, res: '代理不存在' }
            }
            await mongodb.collection('agentBill').insertOne({ billId: _.random(99999999), project: reviewInfo.project, amount: Math.abs(reviewInfo.amount), ownerId: agentInfo.id, ownerName: agentInfo.userName, createAt: Date.now() })
        } else if (reviewInfo.role == 'player') {
            let player = await mongodb.findOne('player', { id: reviewInfo.proposerId })
            if (!player) {
                return ctx.body = { err: true, res: '玩家不存在' }
            }
            await mongodb.collection('playerBill').insertOne({ billId: _.random(99999999), project: reviewInfo.project, amount: Math.abs(reviewInfo.amount), ownerId: player.id, ownerName: player.playerName, createAt: Date.now() })
        }
    } else if (reviewInfo.project == ProjectEnum.reducePoint) {
        if (reviewInfo.role == 'agent') {
            let agentInfo = await mongodb.collection('agent').findOne({ id: reviewInfo.proposerId })
            if (!agentInfo) {
                return ctx.body = { err: true, res: '代理不存在' }
            }
            let balance = await getAgentBalance(agentInfo.id)
            if (balance < inparam.amount) {
                return ctx.body = { err: true, res: '代理余额不足' }
            }
            await mongodb.collection('agentBill').insertOne({ billId: _.random(99999999), project: reviewInfo.project, amount: Math.abs(reviewInfo.amount) * -1, ownerId: agentInfo.id, ownerName: agentInfo.userName, createAt: Date.now() })
        } else if (reviewInfo.role == 'player') {
            let player = await mongodb.collection('player').findOne({ id: reviewInfo.proposerId })
            if (!player) {
                return ctx.body = { err: true, res: '玩家不存在' }
            }
            let balance = await getPlayerBalance(player.id)
            if (balance < inparam.amount) {
                return ctx.body = { err: true, res: '玩家余额不足' }
            }
            await mongodb.collection('palyerBill').insertOne({ billId: _.random(99999999), project: reviewInfo.project, amount: Math.abs(reviewInfo.amount) * -1, ownerId: player.id, ownerName: player.playerName, createAt: Date.now() })
        }
    } else {
        return ctx.body = { err: true, res: '未知操作' }
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