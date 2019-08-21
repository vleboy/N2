const _ = require('lodash')
const Util = require('../util/util.js')
const Router = require('koa-router')
const router = new Router()

/**
 * 变更发放状态
 */
router.get('/update', async (ctx, next) => {
    const mongodb = global.mongodb
    const token = ctx.tokenVerify
    const collectionName = token.role == Util.RoleEnum.agent ? Util.CollectionEnum.agent : Util.CollectionEnum.player

    let user = await mongodb.collection(collectionName).findOne({ id: token.id }, { projection: { bankCards: 1, _id: 0 } })
    if (!user) {
        return ctx.body = { err: true, res: '用户不存在' }
    }
    // ctx.body = user.bankCards
})


module.exports = router