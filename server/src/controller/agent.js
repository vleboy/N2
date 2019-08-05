const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const captchapng = require('captchapng')
const _ = require('lodash')
const Router = require('koa-router')
const router = new Router()

const VerifyCode = {}

/**
 * 代理登陆接口
 */
router.post('/login', async (ctx, next) => {
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (!inparam.userName || !inparam.userPwd || !inparam.code) {
        return ctx.body = { err: true, res: '请检查入参' }
    }
    if (inparam.code != VerifyCode[inparam.userName].code || VerifyCode[inparam.userName].exp < Date.now()) {
        return ctx.body = { err: true, res: '验证码错误或过期' }
    }
    let agentInfo = await mongodb.findOne('agent', { userName: inparam.userName })
    if (!agentInfo) {
        return ctx.body = { err: true, res: '帐号不存在' }
    }
    if (!bcrypt.compareSync(agentInfo.userPwd, inparam.userPwd)) {
        return ctx.body = { err: true, res: '密码不正确' }
    }
    delete VerifyCode[inparam.userName]
    let token = jwt.sign({
        role: agentInfo.role,
        id: agentInfo.id,
        userName: agentInfo.userName,
        userNick: agentInfo.userNick,
        level: agentInfo.level
        // exp: Math.floor(Date.now() / 1000) + 86400 * 30
    }, config.auth.secret)
    ctx.body = { id: agentInfo.id, userNick: agentInfo.userNick, token }
})

/**
 * 获取验证码
 */
router.post('/captcha', async function (ctx, next) {
    let inparam = ctx.request.body
    inparam.code = _.random(1000, 9999)
    // 生成验证码的base64返回
    VerifyCode[inparam.userName] = { code: inparam.code, exp: Date.now() + 3 * 60 * 1000 }
    let p = new captchapng(80, 30, inparam.code)
    p.color(255, 255, 255, 0) // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255)  // Second color: paint (red, green, blue, alpha)
    // 结果返回
    ctx.body = { err: false, res: p.getBase64() }
})

/**
 * 代理转账接口（代理给下级代理转账，代理给玩家转账）
 */
router.post('/handlerPoint', async (ctx, next) => {
    const token = ctx.tokenVerify
    let inparam = ctx.request.body
    let mongodb = global.mongodb
    if (!inparam.ownerId || !inparam.amount || !inparam.project || !inparam.role) {
        return ctx.body = { err: true, res: '请检查入参' }
    }
    if (inparam.role == 'agent') { //代理给代理操作
        let agentInfo = await mongodb.findOne('agent', { id: inparam.ownerId })
        if (!agentInfo) {
            return ctx.body = { err: true, res: '代理不存在' }
        }
        if (token.id != agentInfo.parentId) {
            return ctx.body = { err: true, res: '不能越级操作' }
        }
        if (inparam.project == '转出') {
            let balance = await getAgentBalance(token.id)
            if (balance < inparam.amount) {
                return ctx.body = { err: true, res: '余额不足' }
            }
            //当前代理减点
            await mongodb.insert('agentBill', { billId: _.random(99999999), project: '减点', amount: Math.abs(inparam.amount) * -1, ownerId: token.id, ownerName: token.userName, createAt: Date.now() })
            //请求代理加点
            await mongodb.insert('agentBill', { billId: _.random(99999999), project: '加点', amount: Math.abs(inparam.amount), ownerId: agentInfo.id, ownerName: agentInfo.userName, createAt: Date.now() })
        } else if (inparam.project == '转入') {
            let balance = await getAgentBalance(agentInfo.id)
            if (balance < inparam.amount) {
                return ctx.body = { err: true, res: '余额不足' }
            }
            //当前代理加点
            await mongodb.insert('agentBill', { billId: _.random(99999999), project: '加点', amount: Math.abs(inparam.amount), ownerId: token.id, ownerName: token.userName, createAt: Date.now() })
            //请求代理减点
            await mongodb.insert('agentBill', { billId: _.random(99999999), project: '减点', amount: Math.abs(inparam.amount) * -1, ownerId: agentInfo.id, ownerName: agentInfo.userName, createAt: Date.now() })
        }
    } else if (inparam.role == 'player') { //代理给玩家操作
        let player = await mongodb.findOne('player', { id: inparam.ownerId })
        if (!player) {
            return ctx.body = { err: true, res: '玩家不存在' }
        }
        if (player.parentId != token.id) {
            return ctx.body = { err: true, res: '不能越级操作' }
        }
        if (inparam.project == '转出') {
            let balance = await getAgentBalance(token.id)
            if (balance < inparam.amount) {
                return ctx.body = { err: true, res: '余额不足' }
            }
            //当前代理减点
            await mongodb.insert('agentBill', { billId: _.random(99999999), project: '减点', amount: Math.abs(inparam.amount) * -1, ownerId: token.id, ownerName: token.userName, createAt: Date.now() })
            //请求玩家加点
            await mongodb.insert('playerBill', { billId: _.random(99999999), project: '加点', amount: Math.abs(inparam.amount), ownerId: agentInfo.id, ownerName: agentInfo.userName, createAt: Date.now() })
        } else if (inparam.project == '转入') {
            let balance = await getAgentBalance(agentInfo.id)
            if (balance < inparam.amount) {
                return ctx.body = { err: true, res: '余额不足' }
            }
            //当前代理加点
            await mongodb.insert('agentBill', { billId: _.random(99999999), project: '加点', amount: Math.abs(inparam.amount), ownerId: token.id, ownerName: token.userName, createAt: Date.now() })
            //请求玩家减点
            await mongodb.insert('playerBill', { billId: _.random(99999999), project: '减点', amount: Math.abs(inparam.amount) * -1, ownerId: agentInfo.id, ownerName: agentInfo.userName, createAt: Date.now() })
        }
    }

    ctx.body = { err: false, msg: '操作成功' }
})


/**
 * 代理流水查询
 */
router.post('/queryBill', async (ctx, next) => {

})

/**
 * 代理树型结构
 */
router.get('/tree', async (ctx, next) => {
    const token = ctx.tokenVerify
    let mongodb = global.mongodb
    //查出所有代理
    let agentArr = await mongodb.find('agent', { role: 'agent' })
    if (token.role != 'admin') { //任意层级代理需要过滤代理
        agentArr = _.filter(agentArr, (o) => { return o.levelIndex.indexOf(token.id) != -1 })
    }
    agentArr = _.sortBy(agentArr, ['level'])
    let data = []
    if (token.role == 'admin') {
        data.push({ id: 0, userNick: token.userNick, userName: token.userName, children: [] })
    } else {
        data.push({ ...agentArr.shift(), children: [] })
    }
    tree(data, agentArr)
    ctx.body = data[0].children
})

function tree(treeArray, array) {
    // 遍历所有节点
    for (let treeNode of treeArray) {
        let id = treeNode.id
        let children = treeNode.children || []
        // 遍历剩余节点
        for (let j = 0; j < array.length; j++) {
            let item = array[j]
            item.children = []
            // 找到父亲，加入父亲节点，并从剩余节点删除
            if (item.parentId == id) {
                children.push(item)
                array.splice(j, 1)
                j--
            }
        }
        // 剩余节点不为0时，递归查询
        if (array.length != 0) {
            tree(children, array)
        }
    }
}

//获取代理的余额
async function getAgentBalance(agentId) {
    let balance = 0
    let agentInfo = await mongodb.findOne('agent', { id: agentId })
    if (!agentInfo) {
        throw { err: true, res: '代理不存在' }
    }
    if (agentInfo.level == 0) {
        balance = 'system'
        return balance
    }
    let agentGroupArr = await mongodb.db.collection('agentBill').aggregate([{ $match: { ownerId: agentId } }, { $group: { _id: "$ownerId", count: { $sum: "$amount" } } }]).toArray()
    for (let item of agentGroupArr) {
        if (item._id == agentInfo.id) {
            balance = item.count
            return balance
        }
    }
    return balance
}

module.exports = router