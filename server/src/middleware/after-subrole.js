// 系统配置参数
const config = require('config')
// 路由相关
const Router = require('koa-router')
const router = new Router()
// 工具相关
const _ = require('lodash')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })

/**
 * 创建角色
 */
router.post('/subrole/create', async (ctx, next) => {
    let inparam = ctx.request.body
    ctx.body = { id: inparam.id, createAt: inparam.createAt }
})


/**
 * 查询角色
 */
router.get('/subrole/query', async (ctx, next) => {
    ctx.body = _.orderBy(ctx.body.res, 'createAt', 'desc')
})

module.exports = router