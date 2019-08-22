const cron = require('node-cron')
const _ = require('lodash')
const moment = require('moment')
const NP = require('number-precision')
const Util = require('../util/util.js')
// 日结
cron.schedule('0 */5 * * * *', async () => {
    //构造时间
    let startTime = moment().month(moment().month()).startOf('month').valueOf()
    let endTime = Date.now()
})

// 每月的一号零点统计（上月的利润）0 1 0 1 * *
cron.schedule('0 1 0 1 * *', async () => {
    //构造时间
    let startTime = moment().month(moment().month()-1).startOf('month').valueOf()
    let endTime = moment().month(moment().month()-1).endOf('month').valueOf()
    let month = moment(startTime).format('YYMM')
    await global.mongodb.collection(Util.CollectionEnum.profit).deleteMany({ month })
    // 获取所有配置
    let configArr = await global.mongodb.collection(Util.CollectionEnum.config).find().toArray()
    //获取所有代理
    let agents = await global.mongodb.collection(Util.CollectionEnum.agent).find({ role: Util.RoleEnum.agent }, { projection: { id: 1, role: 1, userName: 1, userNick: 1, mode: 1, modeValue: 1, _id: 0 } }).toArray()
    for (let agent of agents) {
        currentProfit(agent, configArr, startTime, endTime, month)
    }
})

//净利润
async function currentProfit(agent, configArr, startTime, endTime, month) {
    let data = {
        project: Util.ProjectEnum.Profit,     // 类型  
        role: agent.role,                     // 角色
        ownerId: agent.id,                    // ID
        ownerName: agent.userName,             // 账号
        ownerNick: agent.userNick,             // 昵称
        mode: agent.mode,                     // 业务模式
        modeValue: agent.modeValue,           // 业务模式比例

        currentWinlose: 0,                    // 累计输赢
        currentPlatformFee: 0,                // 平台费
        currentCommission: 0,                 // 佣金
        currentCommissionFee: 0,              // 佣金费
        currentDeposit: 0,                    // 存款
        currentDepositFee: 0,                 // 存款手续费
        currentWithdraw: 0,                   // 取款
        currentWithdrawFee: 0,                // 取款手续费
        currentProfit: 0,                     // 纯利润
        status: 0                             // 当前profit状态（0未发放，1已发放）
    }
    let platFeeMap = {}
    // 查询时间范围内的游戏记录
    let p1 = global.mongodb.collection(Util.CollectionEnum.vround).find({ parentId: agent.id, minCreateAt: { $gte: startTime, $lte: endTime } }, { projection: { sourceGameId: 1, winloseAmount: 1, bills: 1, _id: 0 } }).toArray()
    // 查询玩家存款和取款    
    let p2 = global.mongodb.collection(Util.CollectionEnum.review).find({ parentId: agent.id,status:Util.ReviewEnum.Agree, $or: [{ project: Util.ProjectEnum.Deposit }, { project: Util.ProjectEnum.Withdraw }], createAt: { $gte: startTime, $lte: endTime } }, { projection: { project: 1, amount: 1, _id: 0 } }).toArray()
    // 并发请求
    let [rounds, bills] = await Promise.all([p1, p2])
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
        let sourceGameId = round.sourceGameId.toString()
        let plat = `${sourceGameId.substring(0, sourceGameId.length - 2)}00`
        platFeeMap[plat] = (platFeeMap[plat] || platFeeMap[plat] == 0) ? NP.plus(platFeeMap[plat], roundWinloseAmount) : roundWinloseAmount
    }
    // 使用佣金比例计算佣金
    data.currentCommissionFee = +(data.currentCommission * _.find(configArr, o => o.id == 'commission').value / 100).toFixed(2)
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
    data.currentDepositFee = +(data.currentDeposit * _.find(configArr, o => o.id == 'deposit').value / 100).toFixed(2)
    data.currentWithdrawFee = +(data.currentWithdraw * _.find(configArr, o => o.id == 'withdraw').value / 100).toFixed(2)
    data.currentWinlose *= -1  // 代理页面显示（总输赢取反）
    // 当前利润（当前输赢 - 成本）* 业务模式比例
    data.currentProfit = +((data.currentWinlose - data.currentCommissionFee - data.currentPlatformFee - data.currentDepositFee - data.currentWithdrawFee) * agent.modeValue / 100).toFixed(2)
    // 写入发放表
    if (data.currentProfit > 0) {
        data.id = await Util.getSeq('profitSeq')   // 流水号
        data.createAt = Date.now()
        data.month = month
        global.mongodb.collection(Util.CollectionEnum.profit).insertOne(data)
    }
}