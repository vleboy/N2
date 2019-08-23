const _ = require('lodash')
const NP = require('number-precision')
const Util = require('../util/util.js')
const Router = require('koa-router')
const router = new Router()

/**
 * 修复代理的余额
 */
router.post('/repairBalance', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (token.role != Util.RoleEnum.admin) {
        return ctx.body = { err: true, res: '权限不足' }
    }
    let agents = []
    // 更新指定代理
    if (inparam.id) {
        agents.push(await mongodb.collection(Util.CollectionEnum.agent).findOne({ id: inparam.id }, { projection: { id: 1, balance: 1, _id: 0 } }))
    }
    // 更新所有代理
    else {
        agents = await mongodb.collection(Util.CollectionEnum.agent).find({ role: Util.RoleEnum.agent }, { projection: { id: 1, balance: 1, _id: 0 } }).toArray()
    }
    for (let agent of agents) {
        repairBalanceById(agent)
    }
    ctx.body = { err: false, res: '操作成功' }
})

async function repairBalanceById(agent) {
    let bills = await mongodb.collection(Util.CollectionEnum.bill).find({ $or: [{ parentId: agent.id }, { ownerId: agent.id }] }, { projection: { amount: 1, _id: 0 } }).toArray()
    let totalBalance = 0
    for (let bill of bills) {
        totalBalance = NP.plus(totalBalance, bill.amount)
    }
    if (totalBalance != agent.balance) {
        await mongodb.collection(Util.CollectionEnum.agent).updateOne({ id: agent.id }, { $set: { balance: totalBalance } })
        console.log(`代理${agent.id}修正余额前是${agent.balance},修正后余额是${totalBalance}`)
    }
}


module.exports = router