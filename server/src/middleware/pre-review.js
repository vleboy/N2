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
 * 申请充值/提现
 */
router.post('/review/create', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (!inparam.project || !inparam.amount) {
        ctx.body = { err: true, res: '请检查入参' }
    } else {
        let playerInfo = await mongodb.findOne('player', { id: token.id })
        if (!playerInfo) {
            ctx.body = { err: true, res: '玩家不存在' }
        } else {
            inparam.proposerName = playerInfo.playerName
            inparam.status = 0
            inparam.createAt = Date.now()
            inparam.id = _.random(9999999999)
            return next()
        }
    }
})


/**
 * 查询充值/提现
 */
router.get('/review/query', async (ctx, next) => {
    let inparam = ctx.request.query
    let mongodb = global.mongodb

    return next()
})



module.exports = router