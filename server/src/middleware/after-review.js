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
 * 查询审核单
 */
router.get('/review/query', async (ctx, next) => {
    const token = ctx.tokenVerify
    let reviewArr = ctx.body.res
    let res = _.orderBy(reviewArr, ['status', 'createAt'], ['asc', 'desc'])
    ctx.body = res
})

module.exports = router