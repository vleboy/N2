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
 * 查询游戏记录
 */
router.get('/vround/page', async (ctx, next) => {
    const token = ctx.tokenVerify
    console.log(ctx.body.res)
    
    if (ctx.request.commission == Util.ModeEnum.Commission) {
        let configInfo = await mongodb.collection(Util.CollectionEnum.config).findOne({ id: Util.ModeEnum.Commission })
        ctx.body.res.map((round) => {
            let roundBetAmount = _.sumBy(round.bills, o => { if (o.project == Util.ProjectEnum.Bet) return Math.abs(o.amount) })
            round.commission = Math.min(Math.abs(+roundBetAmount.toFixed(2)), Math.abs(round.winloseAmount))
            round.commissionFee = +(round.commission * configInfo.value / 100).toFixed(2)
            round.sourceGameIdStr = Util.GameStrEnum[round.sourceGameId]
            delete round.bills
        })
    } else {
        ctx.body.res.map((round) => {
            round.sourceGameIdStr = Util.GameStrEnum[round.sourceGameId]
            delete round.bills
        })
    }
})

module.exports = router