// 系统配置参数
const config = require('config')
// 路由相关
const Router = require('koa-router')
const router = new Router()
//工具相关
const _ = require('lodash')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })

/**
 * 创建角色
 */
router.post('/role/create', async (ctx, next) => {
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (!inparam.roleName || !inparam.permission) {
        ctx.body = { err: true, res: '请检查入参' }
    } else if (await mongodb.collection('role').findOne( { name: inparam.roleName })) {
        ctx.body = { err: true, res: '角色已存在' }
    } else {
        inparam.createAt = Date.now()
        inparam.id = _.random(9999999999)
        return next()
    }
})


/**
 * 查询角色
 */
router.get('/role/query', async (ctx, next) => {
    let inparam = ctx.request.query
    let mongodb = global.mongodb

    return next()
})

/**
 * 删除角色
 */

module.exports = router