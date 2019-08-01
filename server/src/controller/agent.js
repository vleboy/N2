const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Router = require('koa-router')
const router = new Router()

/**
 * 代理登陆接口
 */
router.post('/login', async (ctx, next) => {
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    let agentInfo = await mongodb.findOne('agent', { userName: inparam.userName })
    if (!agentInfo) {
        ctx.body = { err: true, res: '帐号不存在' }
    } else if (!bcrypt.compareSync(inparam.userPwd, agentInfo.userHashPwd)) {
        ctx.body = { err: true, res: '密码不正确' }
    } else {
        let token = jwt.sign({
            role: agentInfo.role,
            id: agentInfo.id,
            userName: agentInfo.userName,
            userNick: agentInfo.userNick
            // exp: Math.floor(Date.now() / 1000) + 86400 * 30
        }, config.auth.secret)
        ctx.body = { id: agentInfo.id, userNick: agentInfo.userNick, token }
    }
})

/**
 * 代理加减点操作
 */
router.post('/handlerPoint', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (!inparam.ownerId || !inparam.amount || !inparam.project) {
        return ctx.body = { err: true, res: '请检查入参' }
    }
    let agentInfo = await mongodb.findOne('agent', { id: inparam.ownerId })
    if (!agentInfo) {
        return ctx.body = { err: true, res: '代理不存在' }
    }
    if (token.level != 0) {//代理，只能操作直属一级
        if (token.id != agentInfo.parentId) {
            return ctx.body = { err: true, res: '不能越级操作' }
        }
        if (inparam.project == '充值') {
            let balance = await getAgentBalance(token.id)
            if (balance < inparam.amount) {
                return ctx.body = { err: true, res: '余额不足' }
            }
            //当前代理减点
            await mongodb.insert('agentBill', { billId: _.random(99999999), project: '减点', amount: inparam.amount, ownerId: token.id, owenerName: token.userName, createAt: Date.now() })
            //请求代理加点
            await mongodb.insert('agentBill', { billId: _.random(99999999), project: '加点', amount: inparam.amount, ownerId: agentInfo.id, owenerName: agentInfo.userName, createAt: Date.now() })
        } else if (inparam.project == '提现') {
            let balance = await getAgentBalance(agentInfo.id)
            if (balance < inparam.amount) {
                return ctx.body = { err: true, res: '余额不足' }
            }
            //当前代理加点
            await mongodb.insert('agentBill', { billId: _.random(99999999), project: '加点', amount: inparam.amount, ownerId: token.id, owenerName: token.userName, createAt: Date.now() })
            //请求代理减点
            await mongodb.insert('agentBill', { billId: _.random(99999999), project: '减点', amount: inparam.amount, ownerId: agentInfo.id, owenerName: agentInfo.userName, createAt: Date.now() })
        }
    } else { //系统
        if (inparam.project == '充值') {
            //当前代理减点
            await mongodb.insert('agentBill', { billId: _.random(99999999), project: '减点', amount: inparam.amount, ownerId: token.id, owenerName: token.userName, createAt: Date.now() })
            //请求代理加点
            await mongodb.insert('agentBill', { billId: _.random(99999999), project: '加点', amount: inparam.amount, ownerId: agentInfo.id, owenerName: agentInfo.userName, createAt: Date.now() })
        } else if (inparam.project == '提现') {
            let balance = await getAgentBalance(agentInfo.id)
            if (balance < inparam.amount) {
                return ctx.body = { err: true, res: '余额不足' }
            }
            //当前代理加点
            await mongodb.insert('agentBill', { billId: _.random(99999999), project: '加点', amount: inparam.amount, ownerId: token.id, owenerName: token.userName, createAt: Date.now() })
            //请求代理减点
            await mongodb.insert('agentBill', { billId: _.random(99999999), project: '减点', amount: inparam.amount, ownerId: agentInfo.id, owenerName: agentInfo.userName, createAt: Date.now() })
        }
    }

})

/**
 * 启用/停用代理
 */
router.post('/handlerStatus', async (ctx, next) => {

})

/**
 * 代理流水查询
 */
router.post('/queryBill', async (ctx, next) => {

})

//获取代理的余额
async function getAgentBalance(agentId) {
    let agentInfo = await mongodb.findOne('agent', { id: agentId })
    if (!agentInfo) {
        throw { err: true, res: '代理不存在' }
    }
    if (agentInfo.level == 0) {
        return 'system'
    }
    let agentGroupArr = await mongodb.db.collection('agentBill').aggregate([{ $group: { name: "$ownerName", count: { $sum: "$amount" } } }])
    for (let item of agentGroupArr) {
        if (item.name == agentInfo.userName) {
            return item.count
        }
    }
}

module.exports = router