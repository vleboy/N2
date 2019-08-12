const Router = require('koa-router')
const router = new Router()
const _ = require('lodash')
const Util = require('../util/util.js')

/**
 * 系统初始化
 */
router.post('/init', async (ctx, next) => {
    let mongodb = global.mongodb
    if (!await mongodb.collection(Util.CollectionEnum.agent).findOne({ userName: 'admin' })) {
        // 创建集合
        for (let key in Util.CollectionEnum) {
            await mongodb.createCollection(Util.CollectionEnum[key])
        }
        // 创建索引
        await mongodb.collection(Util.CollectionEnum.bill).createIndex({ id: -1 })
        await mongodb.collection(Util.CollectionEnum.review).createIndex({ id: -1 })
        await mongodb.collection(Util.CollectionEnum.message).createIndex({ id: -1 })
        // 预置数据
        await mongodb.collection(Util.CollectionEnum._seq).insertMany([{ seqName: 'billSeq', seqValue: 0 }, { seqName: 'reviewSeq', seqValue: 0 }, { seqName: 'messageSeq', seqValue: 0 }])
        await mongodb.collection(Util.CollectionEnum.agent).insertOne({ id: 100000, userName: 'admin', userPwd: '123456', userNick: '超级管理员', subrole: '超级管理员', status: 1, createAt: Date.now() })
        ctx.body = 'Y'
    } else {
        ctx.body = 'N'
    }
})


/**
 * 创建管理员
 */
router.post('/create', async (ctx, next) => {
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    // 入参检查
    if (!inparam.userName || !inparam.userPwd || !inparam.userNick || !inparam.subrole) {
        return ctx.body = { err: true, res: '请检查入参' }
    }
    if (await mongodb.collection(Util.CollectionEnum.agent).findOne({ $or: [{ userName: inparam.userName }, { userNick: inparam.userNick }] })) {
        return ctx.body = { err: true, res: '帐号/昵称已存在' }
    }
    let flag = true
    while (flag) {
        inparam.id = _.random(100000, 999999)
        if (!await mongodb.collection(Util.CollectionEnum.agent).findOne({ id: inparam.id })) {
            flag = false
        }
    }
    inparam.status = 1
    inparam.role = 'admin'
    inparam.createAt = Date.now()
    let result = await mongodb.collection(Util.CollectionEnum.agent).insertOne(inparam)
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
    let amount = inparam.project == Util.ProjectEnum.addPoint ? Math.abs(inparam.amount) : Math.abs(inparam.amount) * -1
    await mongodb.collection(Util.CollectionEnum.bill).insertOne({ id: await Util.getSeq('billSeq'), role: inparam.role, project: inparam.project, amount, ownerId: inparam.id, ownerName: inparam.ownerName, ownerNick: inparam.ownerNick, parentId: inparam.parentId, createAt: Date.now() })
    ctx.body = { err: false, res: '操作成功' }
})

/**
 * 创建一条 (充值/提现) 申请单
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
    if (inparam.project == Util.ProjectEnum.addPoint) {
        await mongodb.collection(Util.CollectionEnum.review).insertOne({ id: await Util.getSeq('reviewSeq'), role: inparam.role, project: inparam.project, amount: Math.abs(inparam.amount), role: inparam.role, proposerId: inparam.proposerId, proposerName: inparam.proposerName, proposerNick: inparam.proposerNick, parentId: inparam.parentId, status: 0, createdAt: Date.now() })
    } else if (inparam.project == Util.ProjectEnum.reducePoint) {
        const session = await global.getMongoSession()
        try {
            let agentBillId = await Util.getSeq('billSeq')
            await mongodb.collection(Util.CollectionEnum.bill).insertOne({ id: agentBillId, role: inparam.role, project: inparam.project, amount: Math.abs(inparam.amount) * -1, ownerId: inparam.proposerId, ownerName: inparam.proposerName, ownerNick: inparam.proposerNick, parentId: inparam.parentId, createAt: Date.now() }, { session })
            await mongodb.collection(Util.CollectionEnum.review).insertOne({ id: await Util.getSeq('reviewSeq'), billId: agentBillId, project: inparam.project, amount: Math.abs(inparam.amount) * -1, role: inparam.role, proposerId: inparam.proposerId, proposerName: inparam.proposerName, proposerNick: inparam.proposerNick, parentId: inparam.parentId, status: 0, createdAt: Date.now() }, { session })
            await session.commitTransaction()
        } catch (error) {
            console.error(error)
            await session.abortTransaction()
            return ctx.body = { err: true, res: '操作失败，请稍后再试' }
        } finally {
            await session.endSession()
        }
    } else {
        return ctx.body = { err: true, res: '非法操作' }
    }
    ctx.body = { err: false, res: '操作成功' }
})

/**
 * 审核（充值/提现）申请单
 * （来源于申请单可以是代理或者玩家）
 */
router.post('/handlerReview', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (!inparam.id || !(inparam.status == Util.ReviewEnum.Agree || inparam.status == Util.ReviewEnum.Refuse)) {
        return ctx.body = { err: true, res: '请检查入参' }
    }
    let reviewInfo = await mongodb.collection(Util.CollectionEnum.review).findOne({ id: inparam.id })
    if (!reviewInfo) {
        return ctx.body = { err: true, res: '订单不存在' }
    }
    if (reviewInfo.status != Util.ReviewEnum.Process) {
        return ctx.body = { err: true, res: '订单已处理' }
    }
    //检查代理或玩家是否正常
    await checkSystemHandlerReview(reviewInfo)
    //拒绝该订单
    if (inparam.status == Util.ReviewEnum.Refuse) {
        if (reviewInfo.project == Util.ProjectEnum.addPoint) {
            await mongodb.collection(Util.CollectionEnum.review).update({ id: inparam.id }, { $set: { status: Util.ReviewEnum.Refuse, reviewerId: token.id, reviewerName: token.userName, reviewerNick: token.userNick, reviewAt: Date.now() } })
        } else if (reviewInfo.project == Util.ProjectEnum.reducePoint) {
            const session = await global.getMongoSession()
            try {
                //删除流水
                await mongodb.collection(Util.CollectionEnum.bill).remove({ id: reviewInfo.billId }, { session })
                //更新请求单为拒绝状态
                await mongodb.collection(Util.CollectionEnum.review).update({ id: inparam.id }, { $set: { billId: null, status: Util.ReviewEnum.Refuse, reviewerId: token.id, reviewerName: token.userName, reviewerNick: token.userNick, reviewAt: Date.now() } }, { session })
                await session.commitTransaction()
            } catch (error) {
                console.error(error)
                await session.abortTransaction()
                return ctx.body = { err: true, res: '操作失败，请稍后再试' }
            } finally {
                await session.endSession()
            }
        }
    }
    //通过该订单
    else {
        if (reviewInfo.project == Util.ProjectEnum.addPoint) {
            const session = await global.getMongoSession()
            try {
                let billId = await Util.getSeq('billSeq')
                await mongodb.collection(Util.CollectionEnum.bill).insertOne({ id: billId, role: reviewInfo.role, project: reviewInfo.project, amount: Math.abs(reviewInfo.amount), ownerId: reviewInfo.proposerId, ownerName: reviewInfo.proposerName, ownerNick: reviewInfo.proposerNick, parentId: reviewInfo.parentId, createAt: Date.now() }, { session })
                await mongodb.collection(Util.CollectionEnum.review).update({ id: reviewInfo.id }, { $set: { billId, status: Util.ReviewEnum.Agree, reviewerId: token.id, reviewerName: token.userName, reviewerNick: token.userNick, reviewAt: Date.now() } }, { session })
                await session.commitTransaction()
            } catch (error) {
                console.error(error)
                await session.abortTransaction()
                return ctx.body = { err: true, res: '操作失败，请稍后再试' }
            } finally {
                await session.endSession()
            }
        } else if (reviewInfo.project == Util.ProjectEnum.reducePoint) {
            await mongodb.collection(Util.CollectionEnum.review).update({ id: inparam.id }, { $set: { status: Util.ReviewEnum.Agree, reviewerId: token.id, reviewerName: token.userName, reviewerNick: token.userNick, reviewAt: Date.now() } })
        }
    }
    ctx.body = { err: false, res: '操作成功' }
})

//检查用户是否可以变更点数
async function checkUserHandlerPoint(inparam) {
    if (inparam.role == Util.RoleEnum.agent) {
        let agentInfo = await mongodb.collection(Util.CollectionEnum.agent).findOne({ id: inparam.id })
        if (!agentInfo || agentInfo.status == 0) {
            throw { err: true, res: '代理不存在或被停用' }
        }
        if (inparam.project == Util.ProjectEnum.reducePoint) {
            let balance = await Util.getBalanceById(agentInfo.id, inparam.role, agentInfo.lastBalanceTime, agentInfo.lastBalance)
            if (balance < inparam.amount) {
                throw { err: true, res: '代理余额不足' }
            }
        }
        inparam.ownerName = agentInfo.userName
        inparam.ownerNick = agentInfo.userNick
        inparam.parentId = agentInfo.parentId
    } else if (inparam.role == Util.RoleEnum.player) {
        let player = await mongodb.collection(Util.CollectionEnum.player).findOne({ id: inparam.id })
        if (!player || player.status == 0) {
            throw { err: true, res: '玩家不存在或被停用' }
        }
        if (inparam.project == Util.ProjectEnum.reducePoint) {
            let balance = await Util.getBalanceById(player.id, inparam.role, player.lastBalanceTime, player.lastBalance)
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
    if (inparam.role == Util.RoleEnum.agent) {
        let agentInfo = await mongodb.collection(Util.CollectionEnum.agent).findOne({ id: inparam.proposerId })
        if (!agentInfo || agentInfo.status == Util.StatusEnum.Disable) {
            throw { err: true, res: '代理不存在或被停用' }
        }
        if (inparam.project == Util.ProjectEnum.reducePoint) {
            let balance = await Util.getBalanceById(agentInfo.id, inparam.role, agentInfo.lastBalanceTime, agentInfo.lastBalance)
            if (balance < inparam.amount) {
                throw { err: true, res: '余额不足' }
            }
        }
        inparam.proposerName = agentInfo.userName
        inparam.proposerNick = agentInfo.userNick
        inparam.parentId = agentInfo.parentId
    } else if (inparam.role == Util.RoleEnum.player) {
        let player = await mongodb.collection(Util.CollectionEnum.player).findOne({ id: inparam.proposerId })
        if (!player || player.status == Util.StatusEnum.Disable) {
            throw { err: true, res: '玩家不存在或被停用' }
        }
        if (inparam.project == Util.ProjectEnum.reducePoint) {
            let balance = await Util.getBalanceById(player.id, inparam.role, player.lastBalanceTime, player.lastBalance)
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
    if (inparam.role == Util.RoleEnum.agent) {
        let agentInfo = await mongodb.collection(Util.CollectionEnum.agent).findOne({ id: inparam.proposerId })
        if (!agentInfo || agentInfo.status == Util.StatusEnum.Disable) {
            throw { err: true, res: '代理不存在或被停用' }
        }
    } else if (inparam.role == Util.RoleEnum.player) {
        let player = await mongodb.collection(Util.CollectionEnum.player).findOne({ id: inparam.proposerId })
        if (!player || player.status == Util.StatusEnum.Disable) {
            throw { err: true, res: '玩家不存在或被停用' }
        }
    } else {
        throw { err: true, res: '非法角色' }
    }
}

module.exports = router