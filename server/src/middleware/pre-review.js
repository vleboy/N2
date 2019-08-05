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
 * 申请创建一条充值/提现的
 */
router.post('/review/create', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (!inparam.proposerId || !inparam.project || !inparam.amount || !inparam.role) {
        ctx.body = { err: true, res: '请检查入参' }
    } else {
        if (inparam.role == 'agent') {
            let agentInfo = await mongodb.findOne('agent', { id: inparam.proposerId })
            if (!agentInfo) {
                return ctx.body = { err: true, res: '代理不存在' }
            }
            inparam.proposerName = agentInfo.userName
        }
        if (inparam.role == 'player') {
            let playerInfo = await mongodb.findOne('player', { id: inparam.proposerId })
            if (!playerInfo) {
                return ctx.body = { err: true, res: '玩家不存在' }
            }
            inparam.proposerName = playerInfo.playerName
        }
        inparam.status = 0
        inparam.createAt = Date.now()
        inparam.id = _.random(9999999999)
        return next()
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