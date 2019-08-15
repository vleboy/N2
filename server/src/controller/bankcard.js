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
    const collectionName = token.role == Util.RoleEnum.agent ? Util.CollectionEnum.agent : Util.CollectionEnum.player

    let user = await mongodb.collection(collectionName).findOne({ id: token.id }, { projection: { bankCards: 1, _id: 0 } })
    ctx.body = user.bankCards
})

/**
 * 新建银行卡
 */
router.post('/create', async (ctx, next) => {
    const mongodb = global.mongodb
    const token = ctx.tokenVerify
    const inparam = ctx.request.body
    const collectionName = token.role == Util.RoleEnum.agent ? Util.CollectionEnum.agent : Util.CollectionEnum.player

    let user = await mongodb.collection(collectionName).findOne({ id: token.id }, { projection: { bankCards: 1, _id: 0 } })
    user.bankCards.push(inparam)
    await mongodb.collection(collectionName).updateOne({ id: token.id }, { $set: { bankCards: user.bankCards } })
    ctx.body = { err: false, res: '操作成功' }
})

/**
 * 删除银行卡
 */
router.post('/delete/:cardNo', async (ctx, next) => {
    const mongodb = global.mongodb
    const token = ctx.tokenVerify
    const inparam = ctx.request.query
    const collectionName = token.role == Util.RoleEnum.agent ? Util.CollectionEnum.agent : Util.CollectionEnum.player

    let user = await mongodb.collection(collectionName).findOne({ id: token.id }, { projection: { bankCards: 1, _id: 0 } })
    let bankCards = user.bankCards.filter(o => o.cardNo != inparam.cardNo)
    await mongodb.collection(collectionName).updateOne({ id: token.id }, { $set: { bankCards } })
    ctx.body = { err: false, res: '操作成功' }
})

module.exports = router