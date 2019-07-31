const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Router = require('koa-router')
const router = new Router()

/**
 * 代理登陆接口
 */
router.post('/agent/login', async (ctx, next) => {
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    let agentInfo = await mongodb.findOne('agent', { userName: inparam.userName })
    if (!agentInfo) {
        ctx.body = { err: true, res: '帐号不存在' }
    } else if (!bcrypt.compareSync(inparam.userPwd, agentInfo.userHashPwd)) {
        ctx.body = { err: true, res: '密码不正确' }
    } else {
        let token = jwt.sign({
            role: agentInfo.role,
            id: agentInfo.id,
            userName: agentInfo.userName,
            userNick: agentInfo.userNick
            // exp: Math.floor(Date.now() / 1000) + 86400 * 30
        }, config.auth.secret)
        ctx.body = { id: agentInfo.id, userNick: agentInfo.userNick, token }
    }
})

/**
 * 代理加减点操作
 */
router.post('/agent/handlerPoint', async (ctx, next) => {

})

/**
 * 启用/停用代理
 */
router.post('/agent/handlerStatus', async (ctx, next) => {

})

/**
 * 代理流水查询
 */
router.post('/agent/queryBill', async (ctx, next) => {

})

module.exports = router