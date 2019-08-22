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
cron.schedule('*/10 * * * * *', async () => {
    //构造时间
    let startTime = moment().month(moment().month()).startOf('month').valueOf()
    let endTime = moment().month(moment().month()).endOf('month').valueOf()
    let month = moment(startTime).format('YYMM')
    await global.mongodb.collection(Util.CollectionEnum.profit).deleteMany({ month })
    // 获取所有配置
    let configArr = await global.mongodb.collection(Util.CollectionEnum.config).find().toArray()
    //获取所有代理
    let agents = await global.mongodb.collection(Util.CollectionEnum.agent).find({ role: Util.RoleEnum.agent }, { projection: { id: 1, role: 1, userName: 1, userNick: 1, mode: 1, modeValue: 1, _id: 0 } }).toArray()
    for (let agent of agents) {
        profit(agent, configArr, startTime, endTime, month)
    }
})

//净利润
async function profit(agent, configArr, startTime, endTime, month) {
    let data = {
        project: Util.ProjectEnum.Profit,     // 类型  
        role: agent.role,                     // 角色
        ownerId: agent.id,                    // ID
        ownerName: agent.userName,            // 账号
        ownerNick: agent.userNick,            // 昵称
        mode: agent.mode,                     // 业务模式
        modeValue: agent.modeValue,           // 业务模式比例

        winlose: 0,                           // 累计输赢
        platformFee: 0,                       // 平台费
        commission: 0,                        // 佣金
        commissionFee: 0,                     // 佣金费
        deposit: 0,                           // 存款
        depositFee: 0,                        // 存款手续费
        withdraw: 0,                          // 取款
        withdrawFee: 0,                       // 取款手续费
        profit: 0,                            // 纯利润
        status: 0                             // 当前profit状态（0未发放，1已发放）
    }
    let platFeeMap = {}
    // 查询时间范围内的游戏记录
    let p1 = global.mongodb.collection(Util.CollectionEnum.vround).find({ parentId: agent.id, minCreateAt: { $gte: startTime, $lte: endTime } }, { projection: { sourceGameId: 1, winloseAmount: 1, bills: 1, _id: 0 } }).toArray()
    // 查询玩家存款和取款    
    let p2 = global.mongodb.collection(Util.CollectionEnum.review).find({ parentId: agent.id, status: Util.ReviewEnum.Agree, $or: [{ project: Util.ProjectEnum.Deposit }, { project: Util.ProjectEnum.Withdraw }], createAt: { $gte: startTime, $lte: endTime } }, { projection: { project: 1, amount: 1, _id: 0 } }).toArray()
    // 并发请求
    let [rounds, bills] = await Promise.all([p1, p2])
    // 遍历所有游戏记录
    for (let round of rounds) {
        // 当局输赢
        let roundWinloseAmount = +round.winloseAmount.toFixed(2)
        // 累计输赢
        data.winlose = NP.plus(data.winlose, roundWinloseAmount)
        // 累计有效投注
        let roundBetAmount = _.sumBy(round.bills, o => { if (o.project == Util.ProjectEnum.Bet) return Math.abs(o.amount) })
        let roundValidBetAmount = Math.min(Math.abs(+roundBetAmount.toFixed(2)), Math.abs(roundWinloseAmount))
        data.commission = NP.plus(data.commission, roundValidBetAmount)
        // 累计平台输赢
        let sourceGameId = round.sourceGameId.toString()
        let plat = `${sourceGameId.substring(0, sourceGameId.length - 2)}00`
        platFeeMap[plat] = (platFeeMap[plat] || platFeeMap[plat] == 0) ? NP.plus(platFeeMap[plat], roundWinloseAmount) : roundWinloseAmount
    }
    // 使用佣金比例计算佣金
    data.commissionFee = +(data.commission * _.find(configArr, o => o.id == 'commission').value / 100).toFixed(2)
    // 使用平台费比例计算平台费
    for (let plat in platFeeMap) {
        data.platformFee = NP.plus(data.platformFee, +(platFeeMap[plat] * _.find(configArr, o => o.id == plat).value / 100).toFixed(2))
    }
    // 累计玩家存取款
    for (let bill of bills) {
        if (bill.project == Util.ProjectEnum.Deposit) {
            data.deposit = NP.plus(data.deposit, Math.abs(bill.amount))
        } else {
            data.withdraw = NP.plus(data.withdraw, Math.abs(bill.amount))
        }
    }
    // 使用手续费比例计算存取手续费
    data.depositFee = +(data.deposit * _.find(configArr, o => o.id == 'deposit').value / 100).toFixed(2)
    data.withdrawFee = +(data.withdraw * _.find(configArr, o => o.id == 'withdraw').value / 100).toFixed(2)
    data.winlose *= -1           // 总输赢取反(玩家输，代理赢)
    data.platformFee *= -1       //平台费取反（玩家输，平台赢利）
    // 当前利润（当前输赢 - 成本）* 业务模式比例
    data.profit = +((data.winlose - data.commissionFee - data.platformFee - data.depositFee - data.withdrawFee) * agent.modeValue / 100).toFixed(2)
    // 写入发放表
    if (data.profit > 0) {
        data.id = await Util.getSeq('profitSeq')
        data.createAt = Date.now()
        data.month = month
        global.mongodb.collection(Util.CollectionEnum.profit).insertOne(data)
    }
}