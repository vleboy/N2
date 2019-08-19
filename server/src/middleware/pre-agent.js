// 系统配置参数
const config = require('config')
// 路由相关
const Router = require('koa-router')
const router = new Router()
// 工具相关
const _ = require('lodash')
const Util = require('../util/util.js')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })

/**
 * 创建代理
 */
router.post('/agent/create', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    inparam.id = _.random(100000, 999999)
    // 入参检查
    if (!inparam.userName || !inparam.userPwd || !inparam.userNick) {
        return ctx.body = { err: true, res: '请检查入参' }
    }
    if (inparam.userName.length < 3 || inparam.userName.length > 20 || inparam.userPwd.length < 6 || inparam.userPwd.length > 20 || inparam.userNick.length < 3 || inparam.userNick.length > 20) {
        return ctx.body = { err: true, res: '参数不合法' }
    }
    if (inparam.mode != Util.ModeEnum.Rebate && inparam.mode != Util.ModeEnum.Commission && inparam.mode != Util.ModeEnum.Ratio) {
        return ctx.body = { err: true, res: '请选择业务模式' }
    }
    inparam.modeValue = inparam.modeValue || 0
    if (await mongodb.collection(Util.CollectionEnum.agent).findOne({ $or: [{ userName: inparam.userName }, { userNick: inparam.userNick }, { id: inparam.id }] })) {
        return ctx.body = { err: true, res: '帐号/昵称已存在' }
    }
    if (inparam.mode == Util.ModeEnum.Commission && !inparam.gameList) {
        return ctx.body = { err: true, res: '返佣代理需要设置游戏列表' }
    }

    // 查询上级代理
    let parent = inparam.parentId ? await mongodb.collection(Util.CollectionEnum.agent).findOne({ id: inparam.parentId }) : {}
    inparam.status = Util.StatusEnum.Enable
    inparam.role = Util.RoleEnum.agent
    inparam.level = parent.level + 1 || 0
    inparam.parentId = parent.id || 0
    inparam.parentName = parent.userName || 'system'
    inparam.parentNick = parent.userNick || 'system'
    inparam.levelIndex = parent.levelIndex ? `${parent.levelIndex},${inparam.id}` : inparam.id.toString()

    inparam.balance = 0
    inparam.agentCount = 0
    inparam.playerCount = 0

    inparam.bankCards = []
    return next()


})

/**
 * 更新代理
 */
router.post('/agent/update', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    // if (!inparam.id) {
    //     return ctx.body = { err: true, res: '请检查入参' }
    // }
    //只允许更新的参数
    let diffArr = _.difference(Object.keys(inparam), ['id', 'oldPwd', 'userPwd', 'subrole', 'status', 'gameList'])
    if (diffArr.length > 0) {
        return ctx.body = { err: true, res: `以下参数不能更新【${diffArr.join(',')}】` }
    }
    if (inparam.userPwd && (inparam.userPwd.length < 6 || inparam.userPwd.length > 20)) {
        return ctx.body = { err: true, res: '密码长度不合法' }
    }
    if (inparam.gameList && (Util.checkType(inparam.gameList) != 'array')) {
        return ctx.body = { err: true, res: '游戏列表不合法' }
    }
    let agent = await mongodb.collection(Util.CollectionEnum.agent).findOne({ id: inparam.id || token.id })
    if (!agent) {
        return ctx.body = { err: true, res: '代理不存在' }
    }
    // 状态变更权限控制
    if (inparam.status == Util.StatusEnum.Disable || inparam.status == Util.StatusEnum.Enable) {
        if (token.role == Util.RoleEnum.agent && token.id != agent.parentId) {
            return ctx.body = { err: true, res: '不能越级操作' }
        }
    }
    // 密码变更校验旧密码
    if (inparam.oldPwd && inparam.userPwd) {
        if (inparam.oldPwd != agent.userPwd) {
            return ctx.body = { err: true, res: '旧密码不正确' }
        }
        inparam.id = token.id
        delete inparam.oldPwd
    }
    // 传承代理ID，后置路由处理
    ctx.request.agentId = inparam.id
    return next()
})

/**
 * 查询代理
 */
router.get('/agent/query', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.query
    let mongodb = global.mongodb
    if (inparam.id) {
        inparam.id = +inparam.id
    }
    if (inparam.parentId) {
        inparam.parentId = +inparam.parentId
    }
    return next()
})




module.exports = router