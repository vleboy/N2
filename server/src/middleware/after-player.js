// 系统配置参数
const config = require('config')
// 路由相关
const Router = require('koa-router')
const router = new Router()
// 工具
const _ = require('lodash')
const Util = require('../util/util.js')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })

/**
 * 注册玩家
 */
router.post('/player/create', async (ctx, next) => {
    let inparam = ctx.request.body
    mongodb.collection(Util.CollectionEnum.agent).update({ id: inparam.parentId }, { $inc: { playerCount: 1 } })
    ctx.body = { id: inparam.id, createAt: inparam.createAt }
})


/**
 * 查询玩家
 */
router.get('/player/page', async (ctx, next) => {
    const token = ctx.tokenVerify
    // let playerArr = ctx.body.res.res
    // if (token.role == Util.RoleEnum.agent) {
    //     playerArr = _.filter(playerArr, (o) => { return o.parentId == token.id })
    // }
    // let playerList = []
    // for (let item of playerArr) {
    //     playerList.push(_.pick(item, ['id', 'playerName', 'playerNick', 'status', 'role', 'createAt']))
    // }
    // ctx.body = playerList
})

module.exports = router