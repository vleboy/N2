const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const captchapng = require('captchapng')
const _ = require('lodash')
const NP = require('number-precision')
const moment = require('moment')
const Util = require('../util/util.js')
const Router = require('koa-router')
const router = new Router()

const VerifyCode = {}

/**
 * （代理/管理员）登录接口
 */
router.post('/login', async (ctx, next) => {
    const inparam = ctx.request.body
    const mongodb = global.mongodb
    if (!inparam.userName || !inparam.userPwd) {
        return ctx.body = { err: true, res: '请检查入参' }
    }
    if (!inparam.mobile && (inparam.code != VerifyCode[inparam.userName].code || VerifyCode[inparam.userName].exp < Date.now())) {
        return ctx.body = { err: true, res: '验证码错误或过期' }
    }
    let agentInfo = await mongodb.collection(Util.CollectionEnum.agent).findOne({ userName: inparam.userName })
    if (!agentInfo) {
        return ctx.body = { err: true, res: '帐号不存在' }
    }
    if (!bcrypt.compareSync(agentInfo.userPwd, inparam.userPwd)) {
        return ctx.body = { err: true, res: '密码不正确' }
    }
    delete VerifyCode[inparam.userName]
    // 管理员需要查询子角色
    let subrole = {}
    if (agentInfo.role == Util.RoleEnum.admin) {
        subrole = await mongodb.collection(Util.CollectionEnum.subrole).findOne({ roleName: agentInfo.subrole })
        if (!subrole) {
            return ctx.body = { err: true, res: '角色不存在' }
        }
    }
    //更新登录时间 和 IP
    await mongodb.collection(Util.CollectionEnum.agent).update({ userName: inparam.userName }, { $set: { lastLoginAt: Date.now(), lastLoginIP: ctx.request.ip } })
    let token = jwt.sign({
        id: agentInfo.id,
        role: agentInfo.role,
        userName: agentInfo.userName,
        userNick: agentInfo.userNick,
        parentId: agentInfo.parentId,
        level: agentInfo.level,
        subrole: agentInfo.subrole,
        permissions: subrole.permissions
    }, config.auth.secret)
    ctx.body = { id: agentInfo.id, role: agentInfo.role, subrole: agentInfo.subrole, permissions: subrole.permissions, userName: agentInfo.userName, userNick: agentInfo.userNick, token }
})

/**
 * 获取验证码
 */
router.post('/captcha', async function (ctx, next) {
    const inparam = ctx.request.body
    if (!inparam.userName) {
        return ctx.body = { err: true, res: "请检查入参" }
    }
    inparam.code = _.random(1000, 9999)
    VerifyCode[inparam.userName] = { code: inparam.code, exp: Date.now() + 3 * 60 * 1000 }
    // 生成验证码的base64返回
    const p = new captchapng(80, 30, inparam.code)
    p.color(255, 255, 255, 0) // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255)  // Second color: paint (red, green, blue, alpha)
    // 结果返回
    ctx.body = { err: false, res: p.getBase64() }
})

/**
 * 代理列表以树型结构返回
 */
router.get('/tree', async (ctx, next) => {
    const token = ctx.tokenVerify
    const mongodb = global.mongodb
    const inparam = ctx.request.query
    // 查询指定代理
    let query = { role: Util.RoleEnum.agent }
    if (inparam.userName || inparam.userNick) {
        let agent = await mongodb.collection(Util.CollectionEnum.agent).findOne({ $or: [{ userName: inparam.userName }, { userNick: inparam.userNick }] }, { projection: { id: 1, _id: 0 } })
        if (agent) {
            inparam.id = agent.id
        }
    }
    if (inparam.id) {
        query = { levelIndex: { $regex: `.*${inparam.id}.*` } }
    }
    // 查出所有代理
    let agentArr = await mongodb.collection(Util.CollectionEnum.agent).find(query, { projection: { userPwd: 0, _id: 0 } }).toArray()
    if (token.role != 'admin') { //任意层级代理需要过滤代理
        agentArr = _.filter(agentArr, (o) => { return o.levelIndex.indexOf(token.id) != -1 })
    }
    // 属性额外处理
    agentArr = _.sortBy(agentArr, ['level'])
    agentArr.forEach(o => o.modeStr = `${Util.ModeStrEnum[o.mode]}(${o.modeValue}%)`)
    // 组装树结构
    let data = []
    if (token.role != Util.RoleEnum.admin || inparam.id) {
        data.push({ ...agentArr[0], children: [] })
    } else {
        data.push({ id: 0, userName: token.userName, userNick: token.userNick, statue: 1, role: token.role, children: [] })
    }
    tree(data, agentArr)
    if (token.role != Util.RoleEnum.admin || inparam.id) {
        ctx.body = data
    } else {
        ctx.body = data[0].children
    }
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
                treeNode.agentCount += 1
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

/**
 * 获取代理实时数据
 */
router.get('/realtime', async (ctx, next) => {
    const token = ctx.tokenVerify
    const mongodb = global.mongodb
    let agent = await mongodb.collection(Util.CollectionEnum.agent).findOne({ id: token.id }, { projection: { mode: 1, modeValue: 1, playerCount: 1, agentCount: 1, _id: 0 } })
    //构造时间
    let startTime = moment().month(moment().month()).startOf('month').valueOf()
    let endTime = Date.now()
    let data = {
        mode: agent.mode,                     // 业务模式
        modeValue: agent.modeValue,           // 业务模式比例
        playerCount: agent.playerCount,       // 玩家数量
        newRegPlayerCount: 0,                 // 新注册玩家数量
        activePlayerCount: 0                  // 活跃玩家数量                                                  
    }
    let promiseArr = [
        currentWinlose(token.id, startTime, endTime),                                        // 当前输赢（当月1号到现在的输赢金额）
        currentPlatformFee(token.id, startTime, endTime),                                    // 当前平台费（每一类游戏的输赢金额 * 配置表中的比例）
        currentPlayerAmount(token.id, Util.ProjectEnum.Deposit, startTime, endTime),         // 当前存款（当月1号到现在的玩家存款值 * 比例）
        currentPlayerAmount(token.id, Util.ProjectEnum.Withdraw, startTime, endTime),        // 当前取款（当月1号到现在的玩家取款值 * 比例）
        currentCommission(token.id, startTime, endTime)                                      // 当前佣金（当月1号到现在的有效投注 * 比例） 
    ]
    let res = await Promise.all(promiseArr)
    data.currentWinlose = res[0]
    data.currentPlatformFee = res[1]
    data.currentDeposit = res[2]
    data.currentWithdraw = res[3]
    data.currentCommission = res[4]
    // 当前利润（当前输赢 - 成本）* 业务模式比例
    let configInfo = await mongodb.collection(Util.CollectionEnum.config).findOne({ id: Util.ModeEnum.Commission })
    data.currentProfit = (data.currentWinlose - data.currentPlatformFee - data.currentDeposit - data.currentWithdraw - data.currentCommission) * configInfo.value / 100
    ctx.body = data
})

//新注册玩家数量
async function newRegPlayerCount(agentId) {

}

//活跃玩家数量
async function activePlayerCount(agentId) {

}

//本月输赢情况
async function currentWinlose(agentId, startTime, endTime) {
    let totalWinloseAmount = 0
    let bills = await mongodb.collection(Util.CollectionEnum.vround).find({ parentId: agentId, minCreateAt: { $gt: startTime, $lt: endTime } }, { projection: { winloseAmount: 1, _id: 0 } }).toArray()
    for (let item of bills) {
        totalWinloseAmount = NP.plus(+totalWinloseAmount.toFixed(2), +item.winloseAmount.toFixed(2))
    }
    return totalWinloseAmount
}

//获取平台费
async function currentPlatformFee(agentId, startTime, endTime) {
    let platAmount = 0
    let bills = await mongodb.collection(Util.CollectionEnum.vround).find({ parentId: agentId, minCreateAt: { $gt: startTime, $lt: endTime } }, { projection: { _id: 0, winloseAmount: 1, sourceGameId: 1 } }).toArray()
    let billGroup = _.groupBy(bills, 'sourceGameId')
    for (let gameId in billGroup) {
        let configInfo = await mongodb.collection(Util.CollectionEnum.config).findOne({ id: +gameId })
        for (let item of billGroup[gameId]) {
            platAmount = NP.plus(+platAmount.toFixed(2), (+item.winloseAmount.toFixed(2)) * (configInfo.value) / 100)
        }
    }
    return platAmount
}

//获取玩家存款/取款
async function currentPlayerAmount(agentId, project, startTime, endTime) {
    let totalAmount = 0
    let configInfo = await mongodb.collection(Util.CollectionEnum.config).findOne({ id: project })
    let bills = await mongodb.collection(Util.CollectionEnum.bill).find({ parentId: agentId, project: project, createAt: { $gt: startTime, $lt: endTime } }, { projection: { amount: 1, _id: 0 } }).toArray()
    for (let item of bills) {
        totalAmount = NP.plus(totalAmount, item.amount * configInfo.value / 100)
    }
    return totalAmount
}

//当前佣金
async function currentCommission(agentId, startTime, endTime) {
    let totalAmount = 0
    let bills = await mongodb.collection(Util.CollectionEnum.vround).find({ parentId: agentId, minCreateAt: { $gt: startTime, $lt: endTime } }, { projection: { winloseAmount: 1, bills: 1, _id: 0 } }).toArray()
    for (let item of bills) {
        let betAmount = 0
        for (let bill of item.bills) {
            if (bill.project == Util.ProjectEnum.Bet) {
                betAmount = bill.amount
            }
        }
        let mixAmount = Math.min(Math.abs(betAmount), Math.abs(+item.winloseAmount.toFixed(2)))              // 洗码量
        totalAmount = NP.plus(totalAmount, mixAmount)
    }
    return totalAmount
}



module.exports = router