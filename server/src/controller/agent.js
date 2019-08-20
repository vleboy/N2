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
    let query = inparam.mobile ? { userName: inparam.userName, role: Util.RoleEnum.agent } : { userName: inparam.userName }
    let agentInfo = await mongodb.collection(Util.CollectionEnum.agent).findOne(query)
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
    mongodb.collection(Util.CollectionEnum.agent).update({ userName: inparam.userName }, { $set: { lastLoginAt: Date.now(), lastLoginIP: ctx.request.ip } })
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

        currentWinlose: 0,                    // 累计输赢
        currentCommission: 0,                 // 佣金
        currentPlatformFee: 0                 // 平台费
    }
    let platFeeMap = {}
    // 获取所有配置
    let p1 = mongodb.collection(Util.CollectionEnum.config).find().toArray()
    // 查询时间范围内的游戏记录
    let p2 = mongodb.collection(Util.CollectionEnum.vround).find({ parentId: token.id, sourceGameId: { $ne: null }, minCreateAt: { $gte: startTime, $lte: endTime } }, { projection: { sourceGameId: 1, winloseAmount: 1, bills: 1, _id: 0 } }).toArray()
    // 查询玩家存款和取款    
    let p3 = mongodb.collection(Util.CollectionEnum.bill).find({ parentId: token.id, $or: [{ project: Util.ProjectEnum.Deposit }, { project: Util.ProjectEnum.Withdraw }], createAt: { $gte: startTime, $lte: endTime } }, { projection: { project: 1, amount: 1, _id: 0 } }).toArray()
    let p4 = getNewRegPlayerCount(token.id, startTime, endTime)
    let p5 = getActivePlayerCount(token.id, startTime, endTime)
    // 并发请求
    let [configArr, rounds, bills, newRegPlayerCount, activePlayerCount] = await Promise.all([p1, p2, p3, p4, p5])
    data.newRegPlayerCount = newRegPlayerCount
    data.activePlayerCount = activePlayerCount
    // 遍历所有游戏记录
    for (let round of rounds) {
        // 当局输赢
        let roundWinloseAmount = +round.winloseAmount.toFixed(2)
        // 累计输赢
        data.currentWinlose = NP.plus(data.currentWinlose, roundWinloseAmount)
        // 累计有效投注
        let roundBetAmount = _.sumBy(round.bills, o => { if (o.project == Util.ProjectEnum.Bet) return Math.abs(o.amount) })
        let roundValidBetAmount = Math.min(Math.abs(+roundBetAmount.toFixed(2)), Math.abs(roundWinloseAmount))
        data.currentCommission = NP.plus(data.currentCommission, roundValidBetAmount)
        // 累计平台输赢
        console.log(round)
        let plat = `${round.sourceGameId.toString().substring(0, round.sourceGameId.toString().length - 2)}00`
        platFeeMap[plat] = NP.plus(platFeeMap[plat], roundWinloseAmount)
    }
    // 使用佣金比例计算佣金
    data.currentCommission = +(data.currentCommission * _.find(configArr, o => o.id == 'commission').value / 100).toFixed(2)
    // 使用平台费比例计算平台费
    for (let plat in platFeeMap) {
        data.currentPlatformFee = NP.plus(data.currentPlatformFee, +(platFeeMap[plat] * _.find(configArr, o => o.id == plat).value / 100).toFixed(2))
    }
    // 累计玩家存取款
    for (let bill of bills) {
        if (bill.project == Util.ProjectEnum.Deposit) {
            data.currentDeposit = NP.plus(data.currentDeposit, Math.abs(bill.amount))
        } else {
            data.currentWithdraw = NP.plus(data.currentWithdraw, Math.abs(bill.amount))
        }
    }
    // 使用手续费比例计算存取手续费
    data.currentDeposit = +(data.currentDeposit * _.find(configArr, o => o.id == 'deposit').value / 100).toFixed(2)
    data.currentWithdraw = +(data.currentWithdraw * _.find(configArr, o => o.id == 'withdraw').value / 100).toFixed(2)

    // 当前利润（当前输赢 - 成本）* 业务模式比例
    data.currentProfit = +((data.currentWinlose - data.currentCommission - data.currentPlatformFee - data.currentDeposit - data.currentWithdraw) * agent.modeValue / 100).toFixed(2)

    ctx.body = data
})

//新注册玩家数量
function getNewRegPlayerCount(agentId, startTime, endTime) {
    return mongodb.collection(Util.CollectionEnum.player).find({ parentId: agentId, lastLoginAt: { $gt: startTime, $lt: endTime } }).count()
}

//活跃玩家数量
function getActivePlayerCount(agentId, startTime, endTime) {
    return mongodb.collection(Util.CollectionEnum.player).find({ parentId: agentId, lastAuthAt: { $gt: startTime, $lt: endTime } }).count()
}

module.exports = router