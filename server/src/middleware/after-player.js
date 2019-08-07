// 系统配置参数
const config = require('config')
// 身份令牌相关
const jwt = require('jsonwebtoken')
// 路由相关
const Router = require('koa-router')
const router = new Router()
// 工具
const _ = require('lodash')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })

/**
 * 注册玩家
 */
router.post('/player/create', async (ctx, next) => {
    let inparam = ctx.request.body
    ctx.body = { id: inparam.id, createAt: inparam.createAt }
})


/**
 * 查询玩家
 */
router.get('/player/query', async (ctx, next) => {
    let res = _.orderBy(ctx.body.res, 'createAt', 'desc')
    // let playerList = []
    // for (let item of res) {
    //     playerList.push(_.pick(item, ['playerId', 'playerName', 'playerNick', 'id', 'status', 'createAt']))
    // }
    ctx.body = res
})

module.exports = router