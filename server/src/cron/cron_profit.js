const cron = require('node-cron')
const _ = require('lodash')
const moment = require('moment')
const Util = require('../util/util.js')
// 日结
// cron.schedule('0 */5 * * * *', async () => {
// })

// 每月的一号零点统计（上月的利润）0 1 0 1 * *
cron.schedule('*/50 * * * * *', async () => {
    const mongodb = global.mongodb
    //构造时间
    let currentMonth = moment().utcOffset(8).month()
    let startTime = moment().month(currentMonth).startOf('month').valueOf()
    let endTime = moment().month(currentMonth).endOf('month').valueOf()
    let month = moment(startTime).format('YYMM')
    // 获取所有配置
    let configArr = await mongodb.collection(Util.CollectionEnum.config).find().toArray()
    // 删除未发放
    await mongodb.collection(Util.CollectionEnum.profit).deleteMany({ month, status: Util.ReviewEnum.Process })
    // 获取已发放
    let filterAgents = await mongodb.collection(Util.CollectionEnum.profit).find({ month }, { projection: { ownerName: 1, _id: 0 } }).toArray()
    // 获取所有代理，过滤掉已发放的代理
    let agents = await mongodb.collection(Util.CollectionEnum.agent).find({ role: Util.RoleEnum.agent }, { projection: { id: 1, role: 1, userName: 1, userNick: 1, mode: 1, modeValue: 1, _id: 0 } }).toArray()
    for (let agent of agents) {
        if (!filterAgents.find(o => o.ownerName == agent.userName)) {
            profit(agent, configArr, startTime, endTime, month)
        }
    }
})

//净利润
async function profit(agent, configArr, startTime, endTime, month) {
    const mongodb = global.mongodb
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
    // 查询时间范围内的游戏记录
    let p1 = mongodb.collection(Util.CollectionEnum.vround).find({ parentId: agent.id, minCreateAt: { $gte: startTime, $lte: endTime } }, { projection: { sourceGameId: 1, winloseAmount: 1, bills: 1, _id: 0 } }).toArray()
    // 查询玩家存款和取款    
    let p2 = mongodb.collection(Util.CollectionEnum.review).find({ parentId: agent.id, status: Util.ReviewEnum.Agree, $or: [{ project: Util.ProjectEnum.Deposit }, { project: Util.ProjectEnum.Withdraw }], createAt: { $gte: startTime, $lte: endTime } }, { projection: { project: 1, amount: 1, _id: 0 } }).toArray()
    // 并发请求
    let [rounds, bills] = await Promise.all([p1, p2])
    // 统计数据
    Util.calcRebateFee(rounds, bills, configArr, data)
    // 写入发放表
    if (data.profit > 0) {
        data.id = await Util.getSeq('profitSeq')
        data.month = month
        data.createAt = Date.now()
        data.createAtStr = moment(data.createAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
        mongodb.collection(Util.CollectionEnum.profit).insertOne(data)
    }
}