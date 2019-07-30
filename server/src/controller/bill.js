const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Router = require('koa-router')
const router = new Router()

router.get('/balance', async (ctx, next) => {
    let inparam = ctx.request.body
    let mongodb = global.mongodb
})

module.exports = router