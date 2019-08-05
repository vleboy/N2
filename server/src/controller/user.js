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

module.exports = router