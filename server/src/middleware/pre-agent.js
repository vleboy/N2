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
    const token = ctx.tokenVerify
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    // 入参检查
    if (!inparam.userName || !inparam.userPwd || !inparam.userNick) {
        ctx.body = { err: true, res: '请检查入参' }
    } else if (await mongodb.findOne('agent', { $or: [{ userName: inparam.userName }, { userNick: inparam.userNick }] })) {
        ctx.body = { err: true, res: '帐号/昵称已存在' }
    } else {
        // 查询上级代理
        let parent = inparam.parentId ? await mongodb.findOne('agent', { id: inparam.parentId }) : {}
        let flag = true
        while (flag) {
            inparam.id = _.random(999999)
            if (!await mongodb.findOne('agent', { id: inparam.id })) {
                flag = false
            }
        }
        inparam.status = 1
        inparam.parentId = parent.id || 0
        inparam.parentName = parent.userName || ''
        inparam.level = parent.level + 1 || 0
        inparam.levelIndex = parent.levelIndex ? `${parent.levelIndex},${inparam.id}` : inparam.id
        inparam.createAt = Date.now()
        return next()
    }

})

/**
 * 更新代理
 */
router.post('/agent/update', async (ctx, next) => {
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    // inparam = _.pick(inparam, ['userPwd', 'userNick', 'gameList', 'status'])
    if (inparam.userPwd && (inparam.userPwd.length < 6 || inparam.userPwd.length > 20)) {
        ctx.body = { err: true, res: '密码长度不合法' }
    } else if (inparam.userNick && (inparam.userNick.length < 3 || inparam.userNick.length > 20)) {
        ctx.body = { err: true, res: '昵称长度不合法' }
    } else if (inparam.gameList && (checkType(inparam.gameList) != 'array')) {
        ctx.body = { err: true, res: '游戏列表不合法' }
    } else if (!await mongodb.findOne('agent', { id: inparam.id })) {
        ctx.body = { err: true, res: '代理不存在' }
    } else {
        return next()
    }
})

/**
 * 查询代理
 */
router.get('/agent/query', async (ctx, next) => {
    let inparam = ctx.request.query
    let mongodb = global.mongodb

    return next()
})

/****内部方法****/
//校验入参类型
function checkType(o) {
    let s = Object.prototype.toString.call(o)
    return s.match(/\[object (.*?)\]/)[1].toLowerCase()
}


module.exports = router