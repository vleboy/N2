//路由相关
const Router = require('koa-router')
const router = new Router()

/**
 * 创建角色接口
 */
router.post('/createRole', async (ctx, next) => {
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (!inparam.roleName || !inparam.permission) {
        ctx.body = { err: true, res: '请检查入参' }
    } else if (await mongodb.findOne('role', { name: inparam.roleName })) {
        ctx.body = { err: true, res: '角色已存在' }
    } else {
        inparam.createAt = Date.now()
        let result = await mongodb.insert('role', inparam)
        ctx.body = { err: false, res: result.insertedId }
    }
})

/**
 * 删除角色接口
 */
router.post('/delRole', async (ctx, next) => {

})

/**
 * 创建消息接口
 */
router.post('/createMessage', async (ctx, next) => {

})

/**
 * 删除消息接口
 */
router.post('/delMessage', async (ctx, next) => {

})

/**
 * 查询消息列表接口
 */
router.post('/messageList', async (ctx, next) => {

})

/**
 * 查询充值/提现接口
 */
router.post('/queryReviewList', async (ctx, next) => {

})

/**
 * 审核充值/提现接口
 */
router.post('/handlerReview', async (ctx, next) => {

})


module.exports = router