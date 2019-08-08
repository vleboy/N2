//路由相关
const Router = require('koa-router')
const router = new Router()

//工具
const _ = require('lodash')
const { ProjectEnum, RoleEnum, CollectionEnum, ReviewEnum, StatusEnum, GetUniqueID } = require('../util/util')

/**
 * 创建管理员
 */
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
            await mongodb.collection(CollectionEnum.agentBill).insertOne({ id: GetUniqueID(), project: inparam.project, amount: Math.abs(inparam.amount), ownerId: inparam.id, ownerName: inparam.ownerName, ownerNick: inparam.ownerNick, parentId: inparam.parentId, createAt: Date.now() })
        }
        // 给玩家加点
        if (inparam.role == RoleEnum.player) {
            await mongodb.collection(CollectionEnum.playerBill).insertOne({ id: GetUniqueID(), project: inparam.project, amount: Math.abs(inparam.amount), ownerId: inparam.id, ownerName: inparam.ownerName, ownerNick: inparam.ownerNick, parentId: inparam.parentId, createAt: Date.now() })
        }
    }
    // 减点操作
    else if (inparam.project == ProjectEnum.reducePoint) {
        // 给代理减点
        if (inparam.role == RoleEnum.agent) {
            await mongodb.collection(CollectionEnum.agentBill).insertOne({ id: GetUniqueID(), project: inparam.project, amount: Math.abs(inparam.amount) * -1, ownerId: inparam.id, ownerName: inparam.ownerName, ownerNick: inparam.ownerNick, parentId: inparam.parentId, createAt: Date.now() })
        }
        // 给玩家减点
        if (inparam.role == RoleEnum.player) {
            await mongodb.collection(CollectionEnum.playerBill).insertOne({ id: GetUniqueID(), project: inparam.project, amount: Math.abs(inparam.amount) * -1, ownerId: inparam.id, ownerName: inparam.ownerName, ownerNick: inparam.ownerNick, parentId: inparam.parentId, createAt: Date.now() })
        }
    } else {
        return ctx.body = { err: true, res: '未知操作' }
    }
    ctx.body = { err: false, res: '操作成功' }
})


/**
 * 创建一条 (充值/提现) 请求单
 * 代理或玩家可申请
 */
router.post('/createReview', async (ctx, next) => {
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (!inparam.proposerId || !inparam.project || !inparam.amount || !inparam.role) {
        return ctx.body = { err: true, res: '请检查入参' }
    }
    // 检查请求单是否允许
    await checkCreateReview(inparam)
    if (inparam.role == RoleEnum.agent) {
        if (inparam.project == ProjectEnum.addPoint) {

            const session = await global.getMongoSession()
            try {
                let agentBillId = GetUniqueID()
                await mongodb.collection(CollectionEnum.agentBill).insertOne({ id: agentBillId, project: inparam.project, amount: Math.abs(inparam.amount), ownerId: inparam.proposerId, ownerName: inparam.proposerName, ownerNick: inparam.proposerNick, parentId: inparam.parentId, createAt: Date.now() }, { session })
                if (Math.random() > 0.5) {
                    await mongodb.collection(CollectionEnum.review).insertOne({ id: GetUniqueID(), billId: agentBillId, project: inparam.project, amount: Math.abs(inparam.amount), role: inparam.role, proposerId: inparam.proposerId, proposerName: inparam.proposerName, proposerNick: inparam.proposerNick, status: 0, createdAt: Date.now() }, { session })
                } else {
                    throw '异常发生'
                }
                await session.commitTransaction()
            } catch (error) {
                console.error(error)
                await session.abortTransaction()
            } finally {
                await session.endSession()
            }

        } else if (inparam.project == ProjectEnum.reducePoint) {
            let agentBillId = GetUniqueID()
            await mongodb.collection(CollectionEnum.agentBill).insertOne({ id: agentBillId, project: inparam.project, amount: Math.abs(inparam.amount) * -1, ownerId: inparam.proposerId, ownerName: inparam.proposerName, ownerNick: inparam.proposerNick, parentId: inparam.parentId, createAt: Date.now() })
            await mongodb.collection(CollectionEnum.review).insertOne({ id: GetUniqueID(), billId: agentBillId, project: inparam.project, amount: Math.abs(inparam.amount) * -1, role: inparam.role, proposerId: inparam.proposerId, proposerName: inparam.proposerName, proposerNick: inparam.proposerNick, status: 0, createdAt: Date.now() })
        } else {
            return ctx.body = { err: true, res: '非法操作' }
        }
    }
    if (inparam.role == RoleEnum.player) {
        if (inparam.project == ProjectEnum.addPoint) {
            let playerBillId = GetUniqueID()
            await mongodb.collection(CollectionEnum.playerBill).insertOne({ id: playerBillId, project: inparam.project, amount: Math.abs(inparam.amount), ownerId: inparam.proposerId, ownerName: inparam.proposerName, ownerNick: inparam.proposerNick, parentId: inparam.parentId, createAt: Date.now() })
            await mongodb.collection(CollectionEnum.review).insertOne({ id: GetUniqueID(), billId: playerBillId, project: inparam.project, amount: Math.abs(inparam.amount), role: inparam.role, proposerId: inparam.proposerId, proposerName: inparam.proposerName, proposerNick: inparam.proposerNick, status: 0, createdAt: Date.now() })
        } else if (inparam.project == ProjectEnum.reducePoint) {
            let playerBillId = GetUniqueID()
            await mongodb.collection(CollectionEnum.playerBill).insertOne({ id: playerBillId, project: inparam.project, amount: Math.abs(inparam.amount) * -1, ownerId: inparam.proposerId, ownerName: inparam.proposerName, ownerNick: inparam.proposerNick, parentId: inparam.parentId, createAt: Date.now() })
            await mongodb.collection(CollectionEnum.review).insertOne({ id: GetUniqueID(), billId: playerBillId, project: inparam.project, amount: Math.abs(inparam.amount) * -1, role: inparam.role, proposerId: inparam.proposerId, proposerName: inparam.proposerName, proposerNick: inparam.proposerNick, status: 0, createdAt: Date.now() })
        } else {
            return ctx.body = { err: true, res: '非法操作' }
        }
    }
    ctx.body = { err: false, res: '操作成功' }
})

/**
 * 审核（充值/提现）请求单
 * （来源于申请单可以是代理或者玩家）
 */
router.post('/handlerReview', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (!inparam.id || !(inparam.status == ReviewEnum.Agree || inparam.status == ReviewEnum.Refuse)) {
        return ctx.body = { err: true, res: '请检查入参' }
    }
    let reviewInfo = await mongodb.collection('review').findOne({ id: inparam.id })
    if (!reviewInfo) {
        return ctx.body = { err: true, res: '订单不存在' }
    }
    if (reviewInfo.status != ReviewEnum.Process) {
        return ctx.body = { err: true, res: '订单已处理' }
    }
    //检查代理或玩家是否正常
    await checkSystemHandlerReview(reviewInfo)
    if (inparam.status == ReviewEnum.Refuse) { //拒绝该订单
        //删除流水
        if (reviewInfo.role == RoleEnum.agent) {
            await mongodb.collection(CollectionEnum.agentBill).remove({ id: reviewInfo.billId })
        } else if (reviewInfo.role == RoleEnum.player) {
            await mongodb.collection(CollectionEnum.playerBill).remove({ id: reviewInfo.billId })
        }
        //更新请求单为拒绝状态
        await mongodb.collection(CollectionEnum.review).update({ id: inparam.id }, { $set: { status: ReviewEnum.Refuse, reviewerId: token.id, reviewerName: token.userName, reviewerNick: token.userNick, reviewAt: Date.now() } })
    } else { //通过该订单
        //更新请求单为通过
        await mongodb.collection(CollectionEnum.review).update({ id: inparam.id }, { $set: { status: ReviewEnum.Agree, reviewerId: token.id, reviewerName: token.userName, reviewerNick: token.userNick, reviewAt: Date.now() } })
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
        inparam.ownerNick = agentInfo.userNick
        inparam.parentId = agentInfo.parentId
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
        inparam.ownerNick = player.playerNick
        inparam.parentId = player.parentId
    } else {
        throw { err: true, res: '非法角色' }
    }
}

// 检查请求单是否合法
async function checkCreateReview(inparam) {
    if (inparam.role == RoleEnum.agent) {
        let agentInfo = await mongodb.collection(CollectionEnum.agent).findOne({ id: inparam.proposerId })
        if (!agentInfo || agentInfo.status == StatusEnum.Disable) {
            throw { err: true, res: '代理不存在或被停用' }
        }
        if (inparam.project == ProjectEnum.reducePoint) {
            let balance = await getAgentBalance(agentInfo.id)
            if (balance < inparam.amount) {
                throw { err: true, res: '余额不足' }
            }
        }
        inparam.proposerName = agentInfo.userName
        inparam.proposerNick = agentInfo.userNick
        inparam.parentId = agentInfo.parentId
    } else if (inparam.role == RoleEnum.player) {
        let player = await mongodb.collection(CollectionEnum.player).findOne({ id: inparam.proposerId })
        if (!player || player.status == StatusEnum.Disable) {
            throw { err: true, res: '玩家不存在或被停用' }
        }
        if (inparam.project == ProjectEnum.reducePoint) {
            let balance = await getPlayerBalance(player.id)
            if (balance < inparam.amount) {
                throw { err: true, res: '余额不足' }
            }
        }
        inparam.proposerName = player.playerName
        inparam.proposerNick = player.playerNick
        inparam.parentId = player.parentId
    } else {
        throw { err: true, res: '非法角色' }
    }
}

// 检查审核请求单是否可操作
async function checkSystemHandlerReview(inparam) {
    if (inparam.role == RoleEnum.agent) {
        let agentInfo = await mongodb.collection(CollectionEnum.agent).findOne({ id: inparam.proposerId })
        if (!agentInfo || agentInfo.status == StatusEnum.Disable) {
            throw { err: true, res: '代理不存在或被停用' }
        }
    } else if (inparam.role == RoleEnum.player) {
        let player = await mongodb.collection(CollectionEnum.player).findOne({ id: inparam.proposerId })
        if (!player || player.status == StatusEnum.Disable) {
            throw { err: true, res: '玩家不存在或被停用' }
        }
    } else {
        throw { err: true, res: '非法角色' }
    }
}

//获取代理的余额
async function getAgentBalance(agentId) {
    let balance = 0
    let agentGroupArr = await mongodb.collection(CollectionEnum.agentBill).aggregate([{ $match: { ownerId: agentId } }, { $group: { _id: "$ownerId", count: { $sum: "$amount" } } }]).toArray()
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
    let playerGroupArr = await mongodb.collection(CollectionEnum.playerBill).aggregate([{ $match: { ownerId: playerId } }, { $group: { _id: "$ownerId", count: { $sum: "$amount" } } }]).toArray()
    for (let item of playerGroupArr) {
        if (item._id == playerId) {
            return item.count
        }
    }
    return balance
}

module.exports = router