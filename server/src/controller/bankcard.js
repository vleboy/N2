const _ = require('lodash')
const Util = require('../util/util.js')
const Router = require('koa-router')
const router = new Router()

/**
 * 获取银行卡
 */
router.get('/get', async (ctx, next) => {
    const mongodb = global.mongodb
    const token = ctx.tokenVerify
    let agent = await mongodb.collection(Util.CollectionEnum.agent).findOne({ id: token.id }, { projection: { bankCards: 1, _id: 0 } })
    ctx.body = agent.bankCards
})

/**
 * 新建银行卡
 */
router.post('/create', async (ctx, next) => {
    const mongodb = global.mongodb
    const token = ctx.tokenVerify
    let inparam = ctx.request.body
    let agent = await mongodb.collection(Util.CollectionEnum.agent).findOne({ id: token.id }, { projection: { bankCards: 1, _id: 0 } })
    agent.bankCards.push(inparam)
    await mongodb.collection(Util.CollectionEnum.agent).updateOne({ id: token.id }, { $set: { bankCards: agent.bankCards } })
    ctx.body = { err: false, res: '操作成功' }
})

/**
 * 删除银行卡
 */
router.post('/delete/:cardNo', async (ctx, next) => {
    const mongodb = global.mongodb
    const token = ctx.tokenVerify
    let inparam = ctx.request.query
    let agent = await mongodb.collection(Util.CollectionEnum.agent).findOne({ id: token.id }, { projection: { bankCards: 1, _id: 0 } })
    let bankCards = agent.bankCards.map(o => o.cardNo != inparam.cardNo)
    await mongodb.collection(Util.CollectionEnum.agent).updateOne({ id: token.id }, { $set: { bankCards } })
    ctx.body = { err: false, res: '操作成功' }
})

module.exports = router