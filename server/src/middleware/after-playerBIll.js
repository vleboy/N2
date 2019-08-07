// 系统配置参数
const config = require('config')
// 身份令牌相关
const jwt = require('jsonwebtoken')
// 路由相关
const Router = require('koa-router')
const router = new Router()
// 工具
const _ = require('lodash')
const Util = require('../util/util')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })


/**
 * 查询玩家流水
 */
router.get('/playerBill/query', async (ctx, next) => {
    const token = ctx.tokenVerify
    let res = _.orderBy(ctx.body.res, ['createAt'], ['desc'])
    ctx.body = res
})

module.exports = router