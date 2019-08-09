// 系统配置参数
const config = require('config')
// 路由相关
const Router = require('koa-router')
const router = new Router()
// 工具相关
const _ = require('lodash')
const Util = require('../util/util')
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
    const token = ctx.tokenVerify
    let agentArr = ctx.body.res
    if (token.role == Util.RoleEnum.agent) {
        agentArr = _.filter(agentArr, (o) => { return o.levelIndex.indexOf(token.id) != -1 })
    }
    let res = _.orderBy(agentArr, 'createAt', 'desc')
    let agentList = []
    for (let item of res) {
        agentList.push(_.pick(item, ['id', 'userName', 'userNick', 'gameList', 'status', 'subrole', 'role', 'createAt']))
    }
    ctx.body = agentList
})

module.exports = router