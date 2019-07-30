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
 * 创建代理
 */
router.post('/agent/create', async (ctx, next) => {
    let inparam = ctx.request.body
    ctx.body = { id: inparam.id, createAt: inparam.createAt }
})

/**
 * 查询代理
 */
router.get('/agent/query', async (ctx, next) => {
    let res = _.orderBy(ctx.body.res, 'createAt', 'desc')
    let agentList = []
    for (let item of res) {
        agentList.push(_.pick(item, ['userName', 'userNick', 'gameList', 'id', 'status', 'createAt']))
    }
    ctx.body = agentList
})

module.exports = router