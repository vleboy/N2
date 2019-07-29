const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Router = require('koa-router')
const router = new Router()

router.post('/login', async (ctx, next) => {
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    let player = await mongodb.findOne('player', { username: inparam.username })
    if (!player) {
        ctx.body = { err: true, res: '帐号不存在' }
    } else if (!bcrypt.compareSync(player.password, inparam.password)) {
        ctx.body = { err: true, res: '密码不正确' }
    } else {
        let token = jwt.sign({
            role: 'player',
            _id: player._id,
            username: player.username,
            // exp: Math.floor(Date.now() / 1000) + 86400 * 30
        }, config.auth.secret)
        ctx.body = { _id: player._id, username: player.username, token }
    }
})

module.exports = router