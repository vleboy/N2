const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const _ = require('lodash')
const Router = require('koa-router')
const router = new Router()

/**
 * 玩家登陆
 */
router.post('/login', async (ctx, next) => {
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    let player = await mongodb.collection('player').findOne({ playerName: inparam.playerName })
    if (!player) {
        ctx.body = { err: true, res: '帐号不存在' }
    } else if (!bcrypt.compareSync(player.playerPwd, inparam.playerPwd)) {
        ctx.body = { err: true, res: '密码不正确' }
    } else {
        let token = jwt.sign({
            role: player.role,
            id: player.id,
            playerName: player.playerName,
            playerNick: player.playerNick
        }, config.auth.secret)
        ctx.body = { id: player.id, playerNick: player.playerNick, token }
    }
})

module.exports = router