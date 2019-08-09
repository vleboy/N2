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
router.post('/subrole/create', async (ctx, next) => {
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (!inparam.roleName || !inparam.permissions) {
        ctx.body = { err: true, res: '请检查入参' }
    } else if (await mongodb.collection('role').findOne({ name: inparam.roleName })) {
        ctx.body = { err: true, res: '角色已存在' }
    } else {
        let flag = true
        while (flag) {
            inparam.id = _.random(1000, 9999)
            if (!await mongodb.collection('role').findOne({ id: inparam.id })) {
                flag = false
            }
        }
        inparam.createAt = Date.now()
        return next()
    }
})


/**
 * 查询角色
 */
router.get('/subrole/query', async (ctx, next) => {
    let inparam = ctx.request.query
    let mongodb = global.mongodb

    return next()
})

/**
 * 删除角色
 */

module.exports = router