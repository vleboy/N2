const Router = require('koa-router')
const router = new Router()
const _ = require('lodash')
const NP = require('number-precision')
const Util = require('../util/util.js')

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
 * 管理员直接对（代理/玩家）进行(充值/提现)操作
 */
router.post('/handlerPoint', async (ctx, next) => {
    const inparam = ctx.request.body
    const mongodb = global.mongodb
    if (!inparam.id || !inparam.project || !inparam.role || !inparam.amount) {
        return ctx.body = { err: true, res: '请检查入参' }
    }
    const collectionName = inparam.role == Util.RoleEnum.agent ? Util.CollectionEnum.agent : Util.CollectionEnum.player
    let amount = Math.abs(inparam.amount)
    let queryBalance = { id: inparam.id }
    if (inparam.project == Util.ProjectEnum.reducePoint) {
        amount *= -1
        queryBalance.balance = { $gte: Math.abs(amount) }
    }
    // 检查代理/玩家是否满足操作条件
    const owner = await checkHandlerPoint(inparam)
    // 点数处理事务
    const session = await global.getMongoSession()
    try {
        // 变更余额
        const res = await global.mongodb.collection(collectionName).findOneAndUpdate(queryBalance, { $inc: { balance: amount } }, { returnOriginal: false, projection: { balance: 1, _id: 0 } }, { session })
        // 写入流水
        if (res.value) {
            await mongodb.collection(Util.CollectionEnum.bill).insertOne({
                id: await Util.getSeq('billSeq'),
                role: inparam.role,
                project: inparam.project,
                preBalance: NP.minus(balance, amount),
                amount,
                balance: res.value.balance,
                ownerId: owner.id,
                ownerName: owner.ownerName,
                ownerNick: owner.ownerNick,
                parentId: owner.parentId,
                parentName: owner.parentName,
                parentNick: owner.parentNick,
                createAt: Date.now()
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
    ctx.body = { err: false, res: '操作成功' }
})

/**
 * 创建(充值/提现) 申请单
 */
router.post('/createReview', async (ctx, next) => {
    const inparam = ctx.request.body
    const mongodb = global.mongodb
    if (!inparam.id || !inparam.project || !inparam.amount || !inparam.role) {
        return ctx.body = { err: true, res: '请检查入参' }
    }
    const collectionName = inparam.role == Util.RoleEnum.agent ? Util.CollectionEnum.agent : Util.CollectionEnum.player
    let amount = Math.abs(inparam.amount)
    let queryBalance = { id: inparam.id }
    if (inparam.project == Util.ProjectEnum.reducePoint) {
        amount *= -1
        queryBalance.balance = { $gte: Math.abs(amount) }
    }
    // 检查代理/玩家是否满足操作条件
    const owner = await checkHandlerPoint(inparam)
    // 充值申请
    if (inparam.project == Util.ProjectEnum.addPoint) {
        await mongodb.collection(Util.CollectionEnum.review).insertOne({
            id: await Util.getSeq('reviewSeq'),
            role: inparam.role,
            project: inparam.project,
            amount: Math.abs(amount),
            role: inparam.role,
            proposerId: owner.id,
            proposerName: owner.ownerName,
            proposerNick: owner.ownerNick,
            parentId: owner.parentId,
            parentName: owner.parentName,
            parentNick: owner.parentNick,
            status: 0,
            createdAt: Date.now()
        })
    }
    // 提现申请 
    else if (inparam.project == Util.ProjectEnum.reducePoint) {
        const session = await global.getMongoSession()
        try {
            // 变更余额
            const res = await global.mongodb.collection(collectionName).findOneAndUpdate(queryBalance, { $inc: { balance: amount } }, { returnOriginal: false, projection: { balance: 1, _id: 0 } }, { session })
            // 写入流水，创建提现单
            if (res.value) {
                const billId = await Util.getSeq('billSeq')
                await mongodb.collection(Util.CollectionEnum.bill).insertOne({
                    id: billId,
                    role: inparam.role,
                    project: inparam.project,
                    preBalance: NP.minus(balance, amount),
                    amount,
                    balance: res.value.balance,
                    ownerId: owner.id,
                    ownerName: owner.ownerName,
                    ownerNick: owner.ownerNick,
                    parentId: owner.parentId,
                    parentName: owner.parentName,
                    parentNick: owner.parentNick,
                    createAt: Date.now()
                }, { session })
                await mongodb.collection(Util.CollectionEnum.review).insertOne({
                    id: await Util.getSeq('reviewSeq'),
                    billId,
                    project: inparam.project,
                    amount: Math.abs(amount),
                    role: inparam.role,
                    proposerId: owner.id,
                    proposerName: owner.ownerName,
                    proposerNick: owner.ownerNick,
                    parentId: owner.parentId,
                    parentName: owner.parentName,
                    parentNick: owner.parentNick,
                    status: 0,
                    createdAt: Date.now()
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
    }
    ctx.body = { err: false, res: '操作成功' }
})

/**
 * 审核（充值/提现）申请单
 */
router.post('/handlerReview', async (ctx, next) => {
    const token = ctx.tokenVerify
    const inparam = ctx.request.body
    const mongodb = global.mongodb
    if (!inparam.id || !(inparam.status == Util.ReviewEnum.Agree || inparam.status == Util.ReviewEnum.Refuse)) {
        return ctx.body = { err: true, res: '请检查入参' }
    }
    let reviewInfo = await mongodb.collection(Util.CollectionEnum.review).findOne({ id: inparam.id })
    if (!reviewInfo || reviewInfo.status != Util.ReviewEnum.Process) {
        return ctx.body = { err: true, res: '订单不存在或已处理' }
    }
    // 检查代理或玩家是否正常
    const collectionName = reviewInfo.role == Util.RoleEnum.agent ? Util.CollectionEnum.agent : Util.CollectionEnum.player
    const owner = await checkHandlerPoint({ id: reviewInfo.proposerId, role: reviewInfo.role })
    // 拒绝该订单
    if (inparam.status == Util.ReviewEnum.Refuse) {
        if (reviewInfo.project == Util.ProjectEnum.addPoint) {
            await mongodb.collection(Util.CollectionEnum.review).update({ id: inparam.id }, { $set: { status: inparam.status, reviewerId: token.id, reviewerName: token.userName, reviewerNick: token.userNick, reviewAt: Date.now() } })
        } else if (reviewInfo.project == Util.ProjectEnum.reducePoint) {
            const session = await global.getMongoSession()
            try {
                // 变更余额
                const res = await global.mongodb.collection(collectionName).findOneAndUpdate({ id: reviewInfo.proposerId }, { $inc: { balance: reviewInfo.amount } }, { returnOriginal: false, projection: { balance: 1, _id: 0 } }, { session })
                // 写入流水，更新请求单为拒绝状态
                let billId = await Util.getSeq('billSeq')
                await mongodb.collection(Util.CollectionEnum.bill).insertOne({
                    id: billId,
                    role: inparam.role,
                    project: Util.ProjectEnum.addPoint,
                    preBalance: NP.minus(balance, reviewInfo.amount),
                    amount: reviewInfo.amount,
                    balance: res.value.balance,
                    ownerId: reviewInfo.proposerId,
                    ownerName: reviewInfo.proposerName,
                    ownerNick: reviewInfo.proposerNick,
                    parentId: reviewInfo.parentId,
                    parentName: reviewInfo.parentName,
                    parentNick: reviewInfo.parentNick,
                    createAt: Date.now()
                }, { session })
                await mongodb.collection(Util.CollectionEnum.review).update({ id: inparam.id }, { $set: { billId: null, status: inparam.status, reviewerId: token.id, reviewerName: token.userName, reviewerNick: token.userNick, reviewAt: Date.now() } }, { session })
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
                // 变更余额
                const res = await global.mongodb.collection(inparam.collectionName).findOneAndUpdate({ id: reviewInfo.proposerId }, { $inc: { balance: reviewInfo.amount } }, { returnOriginal: false, projection: { balance: 1, _id: 0 } }, { session })
                // 写入流水，更新请求单为同意状态
                const billId = await Util.getSeq('billSeq')
                await mongodb.collection(Util.CollectionEnum.bill).insertOne({
                    id: billId,
                    role: reviewInfo.role,
                    project: Util.ProjectEnum.addPoint,
                    preBalance: NP.minus(balance, amount),
                    amount: reviewInfo.amount,
                    balance: res.value.balance,
                    ownerId: reviewInfo.proposerId,
                    ownerName: reviewInfo.proposerName,
                    ownerNick: reviewInfo.proposerNick,
                    parentId: reviewInfo.parentId,
                    parentName: reviewInfo.parentName,
                    parentNick: reviewInfo.parentNick,
                    createAt: Date.now()
                }, { session })
                await mongodb.collection(Util.CollectionEnum.review).update({ id: reviewInfo.id }, { $set: { billId, status: inparam.status, reviewerId: token.id, reviewerName: token.userName, reviewerNick: token.userNick, reviewAt: Date.now() } }, { session })
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

// 检查用户合法性
async function checkHandlerPoint(inparam) {
    const collectionName = inparam.role == Util.RoleEnum.agent ? Util.CollectionEnum.agent : Util.CollectionEnum.player
    const user = await mongodb.collection(collectionName).findOne({ id: inparam.id })
    if (!user || user.status == 0) {
        throw { err: true, res: '帐号不存在或被停用' }
    }
    const id = user.id
    const ownerName = user.userName
    const ownerNick = user.userNick
    const parentId = user.parentId
    const parentName = user.parentName
    const parentNick = user.parentNick
    if (inparam.role == Util.RoleEnum.player) {
        ownerName = user.playerName
        ownerName = user.playerNick
    }
    return { id, ownerName, ownerNick, parentId, parentName, parentNick }
}

module.exports = router