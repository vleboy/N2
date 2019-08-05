//路由相关
const Router = require('koa-router')
const router = new Router()

//工具
const _ = require('lodash')
const { GetHashPwd } = require('../util/util')

//创建管理员
router.post('/create', async (ctx, next) => {
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    // 入参检查
    if (!inparam.userName || !inparam.userPwd || !inparam.userNick) {
        ctx.body = { err: true, res: '请检查入参' }
    }
    if (await mongodb.findOne('agent', { $or: [{ userName: inparam.userName }, { userNick: inparam.userNick }] })) {
        ctx.body = { err: true, res: '帐号/昵称已存在' }
    }
    let flag = true
    while (flag) {
        inparam.id = _.random(100000, 999999)
        if (!await mongodb.findOne('agent', { id: inparam.id })) {
            flag = false
        }
    }
    inparam.status = 1
    inparam.role = 'admin'
    inparam.userHashPwd = GetHashPwd(inparam.userPwd)
    inparam.createAt = Date.now()
    let result = await mongodb.insert('agent', inparam)
    ctx.body = { err: false, res: result.insertedId }
})

//管理员充值、提现接口（可对代理操作，可对玩家操作）
router.post('/handlerPoint', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (!inparam.id || !inparam.project || !inparam.role || !inparam.amount) {
        return ctx.body = { err: true, res: '请检查入参' }
    }
    if (inparam.project == '充值') {
        if (inparam.role == 'agent') {
            let agentInfo = await mongodb.findOne('agent', { id: inparam.id })
            if (!agentInfo) {
                return ctx.body = { err: true, res: '代理不存在' }
            }
            await mongodb.insert('agentBill', { billId: _.random(99999999), project: '加点', amount: Math.abs(inparam.amount), ownerId: agentInfo.id, ownerName: agentInfo.userName, createAt: Date.now() })
        } else if (inparam.role == 'player') {
            let player = await mongodb.findOne('player', { id: inparam.id })
            if (!player) {
                return ctx.body = { err: true, res: '玩家不存在' }
            }
            await mongodb.insert('playerBill', { billId: _.random(99999999), project: '加点', amount: Math.abs(inparam.amount), ownerId: player.id, ownerName: player.userName, createAt: Date.now() })
        }
    } else if (inparam.project == '提现') {
        if (inparam.role == 'agent') {
            let agentInfo = await mongodb.findOne('agent', { id: inparam.id })
            if (!agentInfo) {
                return ctx.body = { err: true, res: '代理不存在' }
            }
            await mongodb.insert('agentBill', { billId: _.random(99999999), project: '减点', amount: Math.abs(inparam.amount) * -1, ownerId: agentInfo.id, ownerName: agentInfo.userName, createAt: Date.now() })
        } else if (inparam.role == 'player') {
            let player = await mongodb.findOne('player', { id: inparam.id })
            if (!player) {
                return ctx.body = { err: true, res: '玩家不存在' }
            }
            await mongodb.insert('playerBill', { billId: _.random(99999999), project: '减点', amount: Math.abs(inparam.amount) * -1, ownerId: player.id, ownerName: player.userName, createAt: Date.now() })
        }
    }
    ctx.body = { err: false, res: '操作成功' }
})

module.exports = router