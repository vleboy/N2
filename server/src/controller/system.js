const Router = require('koa-router')
const router = new Router()
const _ = require('lodash')
const moment = require('moment')
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
    inparam.createAtStr = moment(inparam.createAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
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
    inparam.project = inparam.project == 1 ? Util.ProjectEnum.Add : Util.ProjectEnum.Reduce
    const collectionName = inparam.role == Util.RoleEnum.agent ? Util.CollectionEnum.agent : Util.CollectionEnum.player
    let amount = Math.abs(inparam.amount)
    let queryBalance = { id: inparam.id }
    if (inparam.project == Util.ProjectEnum.Reduce) {
        amount *= -1
        queryBalance.balance = { $gte: Math.abs(amount) }
    }
    // 检查代理/玩家是否满足操作条件
    const owner = await Util.checkHandlerPoint(inparam)
    // 点数处理事务
    const session = await global.getMongoSession()
    try {
        // TODO 玩家点数与N1同步

        // 变更余额
        const res = await global.mongodb.collection(collectionName).findOneAndUpdate(queryBalance, { $inc: { balance: amount } }, { returnOriginal: true, projection: { balance: 1, _id: 0 }, session })
        // 写入流水
        if (res.value) {
            let createAt = Date.now()
            await mongodb.collection(Util.CollectionEnum.bill).insertOne({
                id: await Util.getSeq('billSeq'),
                role: inparam.role,
                project: inparam.project,
                preBalance: +res.value.balance.toFixed(2),
                amount,
                balance: NP.plus(+res.value.balance.toFixed(2), amount),
                ownerId: owner.id,
                ownerName: owner.ownerName,
                ownerNick: owner.ownerNick,
                parentId: owner.parentId,
                parentName: owner.parentName,
                parentNick: owner.parentNick,
                createAt,
                createAtStr: moment(createAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
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
    const token = ctx.tokenVerify
    if (!inparam.project || !inparam.amount) {
        return ctx.body = { err: true, res: '请检查入参' }
    }
    inparam.id = token.id
    inparam.role = token.role
    inparam.project = inparam.project == 1 ? Util.ProjectEnum.Deposit : Util.ProjectEnum.Withdraw
    const collectionName = inparam.role == Util.RoleEnum.agent ? Util.CollectionEnum.agent : Util.CollectionEnum.player
    let amount = Math.abs(inparam.amount)
    let queryBalance = { id: inparam.id }
    if (inparam.project == Util.ProjectEnum.Withdraw) {
        amount *= -1
        queryBalance.balance = { $gte: Math.abs(amount) - 0.001 }
    }
    // 检查代理/玩家是否满足操作条件
    const owner = await Util.checkHandlerPoint(inparam)
    // 如果是玩家判断流水是否足够提现
    if (inparam.role == Util.CollectionEnum.player && inparam.project == Util.ProjectEnum.Withdraw) {
        let { commission, depositAmount } = await Util.getPlayerCommission(inparam)
        if (commission < depositAmount * 2) {
            return ctx.body = { err: true, res: '取款需满足两倍流水' }
        }
    }
    let createAt = Date.now()
    // 充值申请
    if (inparam.project == Util.ProjectEnum.Deposit) {
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
            createAt,
            createAtStr: moment(createAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
        })
    }
    // 提现申请 
    else if (inparam.project == Util.ProjectEnum.Withdraw) {
        if (!inparam.cardBank || !inparam.cardName || !inparam.cardNo) {
            return ctx.body = { err: true, res: '请选择银行卡' }
        }
        const session = await global.getMongoSession()
        try {
            // TODO 玩家点数与N1同步
            // 变更余额
            const res = await global.mongodb.collection(collectionName).findOneAndUpdate(queryBalance, { $inc: { balance: amount } }, { returnOriginal: true, projection: { balance: 1, _id: 0 }, session })
            // 写入流水，创建提现单
            if (res.value) {
                const billId = await Util.getSeq('billSeq')
                await mongodb.collection(Util.CollectionEnum.bill).insertOne({
                    id: billId,
                    role: inparam.role,
                    project: Util.ProjectEnum.Freeze,
                    preBalance: +res.value.balance.toFixed(2),
                    amount,
                    balance: NP.plus(+res.value.balance.toFixed(2), amount),
                    ownerId: owner.id,
                    ownerName: owner.ownerName,
                    ownerNick: owner.ownerNick,
                    parentId: owner.parentId,
                    parentName: owner.parentName,
                    parentNick: owner.parentNick,
                    createAt,
                    createAtStr: moment(createAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
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
                    cardBank: inparam.cardBank,
                    cardName: inparam.cardName,
                    cardNo: inparam.cardNo,
                    createAt,
                    createAtStr: moment(createAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
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
    const owner = await Util.checkHandlerPoint({ id: reviewInfo.proposerId, role: reviewInfo.role })
    let createAt = Date.now()
    // 拒绝该订单
    if (inparam.status == Util.ReviewEnum.Refuse) {
        if (reviewInfo.project == Util.ProjectEnum.Deposit) {
            await mongodb.collection(Util.CollectionEnum.review).updateOne({ id: inparam.id }, { $set: { status: inparam.status, reviewerId: token.id, reviewerName: token.userName, reviewerNick: token.userNick, reviewAt: createAt, reviewAtStr: moment(createAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss') } })
        } else if (reviewInfo.project == Util.ProjectEnum.Withdraw) {
            const session = await global.getMongoSession()
            try {
                // TODO 玩家点数与N1同步
                // 变更余额
                const res = await mongodb.collection(collectionName).findOneAndUpdate({ id: reviewInfo.proposerId }, { $inc: { balance: reviewInfo.amount } }, { returnOriginal: true, projection: { balance: 1, _id: 0 }, session })
                // 写入流水，更新请求单为拒绝状态
                let billId = await Util.getSeq('billSeq')
                await mongodb.collection(Util.CollectionEnum.bill).insertOne({
                    id: billId,
                    role: reviewInfo.role,
                    project: Util.ProjectEnum.Unfreeze,
                    preBalance: +res.value.balance.toFixed(2),
                    amount: reviewInfo.amount,
                    balance: NP.plus(+res.value.balance.toFixed(2), reviewInfo.amount),
                    ownerId: owner.id,
                    ownerName: owner.ownerName,
                    ownerNick: owner.ownerNick,
                    parentId: owner.parentId,
                    parentName: owner.parentName,
                    parentNick: owner.parentNick,
                    createAt,
                    createAtStr: moment(createAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
                }, { session })
                await mongodb.collection(Util.CollectionEnum.review).updateOne({ id: inparam.id }, { $set: { billId: null, status: inparam.status, reviewerId: token.id, reviewerName: token.userName, reviewerNick: token.userNick, reviewAt: createAt, reviewAtStr: moment(createAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss') } }, { session })
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
        if (reviewInfo.project == Util.ProjectEnum.Deposit) {
            const session = await global.getMongoSession()
            try {
                // TODO 玩家点数与N1同步
                // 变更余额
                const res = await mongodb.collection(collectionName).findOneAndUpdate({ id: reviewInfo.proposerId }, { $inc: { balance: reviewInfo.amount } }, { returnOriginal: true, projection: { balance: 1, _id: 0 }, session })
                // 写入流水，更新请求单为同意状态
                const billId = await Util.getSeq('billSeq')
                await mongodb.collection(Util.CollectionEnum.bill).insertOne({
                    id: billId,
                    role: reviewInfo.role,
                    project: Util.ProjectEnum.Deposit,
                    preBalance: +res.value.balance.toFixed(2),
                    amount: reviewInfo.amount,
                    balance: NP.plus(+res.value.balance.toFixed(2), reviewInfo.amount),
                    ownerId: owner.id,
                    ownerName: owner.ownerName,
                    ownerNick: owner.ownerNick,
                    parentId: owner.parentId,
                    parentName: owner.parentName,
                    parentNick: owner.parentNick,
                    createAt,
                    createAtStr: moment(createAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
                }, { session })
                await mongodb.collection(Util.CollectionEnum.review).updateOne({ id: reviewInfo.id }, { $set: { billId, status: inparam.status, reviewerId: token.id, reviewerName: token.userName, reviewerNick: token.userNick, reviewAt: createAt, reviewAtStr: moment(createAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss') } }, { session })
                await session.commitTransaction()
            } catch (error) {
                console.error(error)
                await session.abortTransaction()
                return ctx.body = { err: true, res: '操作失败，请稍后再试' }
            } finally {
                await session.endSession()
            }
        } else if (reviewInfo.project == Util.ProjectEnum.Withdraw) {
            const session = await global.getMongoSession()
            try {
                // 变更余额
                let res = await mongodb.collection(collectionName).findOneAndUpdate({ id: reviewInfo.proposerId }, { $inc: { balance: reviewInfo.amount } }, { returnOriginal: true, projection: { balance: 1, _id: 0 }, session })
                // 写入流水，先解冻
                let billId = await Util.getSeq('billSeq')
                await mongodb.collection(Util.CollectionEnum.bill).insertOne({
                    id: billId,
                    role: reviewInfo.role,
                    project: Util.ProjectEnum.Unfreeze,
                    preBalance: +res.value.balance.toFixed(2),
                    amount: reviewInfo.amount,
                    balance: NP.plus(+res.value.balance.toFixed(2), reviewInfo.amount),
                    ownerId: owner.id,
                    ownerName: owner.ownerName,
                    ownerNick: owner.ownerNick,
                    parentId: owner.parentId,
                    parentName: owner.parentName,
                    parentNick: owner.parentNick,
                    createAt,
                    createAtStr: moment(createAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
                }, { session })
                // 变更余额
                res = await mongodb.collection(collectionName).findOneAndUpdate({ id: reviewInfo.proposerId }, { $inc: { balance: reviewInfo.amount * -1 } }, { returnOriginal: true, projection: { balance: 1, _id: 0 }, session })
                // 写入流水，再提现
                billId = await Util.getSeq('billSeq')
                await mongodb.collection(Util.CollectionEnum.bill).insertOne({
                    id: billId,
                    role: reviewInfo.role,
                    project: Util.ProjectEnum.Withdraw,
                    preBalance: +res.value.balance.toFixed(2),
                    amount: reviewInfo.amount * -1,
                    balance: NP.plus(+res.value.balance.toFixed(2), reviewInfo.amount * -1),
                    ownerId: owner.id,
                    ownerName: owner.ownerName,
                    ownerNick: owner.ownerNick,
                    parentId: owner.parentId,
                    parentName: owner.parentName,
                    parentNick: owner.parentNick,
                    createAt: createAt + 1,
                    createAtStr: moment(createAt + 1).utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
                }, { session })
                await mongodb.collection(Util.CollectionEnum.review).updateOne({ id: reviewInfo.id }, { $set: { billId, status: inparam.status, reviewerId: token.id, reviewerName: token.userName, reviewerNick: token.userNick, reviewAt: createAt, reviewAtStr: moment(createAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss') } }, { session })
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
    ctx.body = { err: false, res: '操作成功' }
})


module.exports = router