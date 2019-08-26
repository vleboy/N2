const _ = require('lodash')
const moment = require('moment')
const NP = require('number-precision')
const axios = require('axios')
const config = require('config')

//角色枚举
const RoleEnum = {
    agent: 'agent',
    admin: 'admin',
    player: 'player'
}
//流水项目枚举
const ProjectEnum = {
    Add: 'add',                 // 加点
    Reduce: 'reduce',           // 减点

    Deposit: 'deposit',         // 存款
    Withdraw: 'withdraw',       // 取款
    Unfreeze: 'unfreeze',       // 解冻

    TransferIn: 'transferIn',   // 转入
    TransferOut: 'transferOut', // 转出

    Profit: 'profit',           // 收益

    Bet: 'bet',                 // 投注
    Win: 'win',                 // 返奖
    Refund: 'refund'            // 退款
}
const ProjectStrEnum = {
    add: '加点',
    reduce: '减点',

    deposit: '存款',
    withdraw: '取款',
    unfreeze: '解冻',

    transferIn: '转入',
    transferOut: '转出',

    profit: '收益',

    bet: '投注',
    win: '返奖',
    refund: '退款'
}
//启用/停用枚举
const StatusEnum = {
    Enable: 1,
    Disable: 0
}
//审核单转态枚举
const ReviewEnum = {
    Process: 0,
    Agree: 1,
    Refuse: 2,
}
//业务模式枚举
const ModeEnum = {
    Rebate: 'rebate',           // 返利
    Commission: 'commission',   // 返佣
    Ratio: 'ratio',             // 占成
}
const ModeStrEnum = {
    rebate: '返利',
    commission: '返佣',
    ratio: '占成'
}
// 消息枚举
const MsgEnum = {
    NoticeAll: 'noticeAll',
    NoticeAgent: 'noticeAgent',
    NoticePlayer: 'noticePlayer',
    Private: 'private'
}
const MsgStrEnum = {
    noticeAll: '全体公告',
    noticeAgent: '代理公告',
    noticePlayer: '玩家公告',
    private: '私信'
}

// 游戏枚举
const GameStrEnum = {
    70001: "塔罗之谜",
    70002: "小厨娘",
    70003: "降龙献瑞",
    70004: "四方神兽",
    70005: "财神进宝",
    70006: "福运亨通",
    70007: "熊猫传奇",
    70010: "财源广进",
    70011: "珠光宝气",
    70012: "锦鲤",
    70013: "金狮送福",
    70014: "幸运钱庄",
    70022: "年年有余",
    70024: "猪年大吉",
    70026: "财神到",
    70028: "老寿星",
    70030: "凤舞朝阳",
    70032: "鲤跃龙门"
}
// 平台枚举
const PlatStrEnum = {
    70000: 'NA电子',
    10300000: 'MG电子',
    1080000: 'SUN电子',
    1160000: 'PP电子',
    1050000: 'AG真人',
    1120000: 'SUN真人',
    1130000: 'YSB体育',
    1170000: 'NA电竞',
    1100000: 'VG棋牌'
}

//数据库集合枚举
const CollectionEnum = {
    _seq: '_seq',
    agent: 'agent',
    message: 'message',
    player: 'player',
    review: 'review',
    subrole: 'subrole',
    bill: 'bill',
    profit: 'profit',
    config: 'config',

    vround: 'vround'
}

//检查类型
function checkType(o) {
    let s = Object.prototype.toString.call(o)
    return s.match(/\[object (.*?)\]/)[1].toLowerCase()
}

// 获取自增键
async function getSeq(seqName) {
    const res = await global.mongodb.collection(CollectionEnum._seq).findOneAndUpdate(
        { seqName },
        { $inc: { seqValue: 1 } },
        { returnOriginal: false, projection: { seqValue: 1, _id: 0 } }
    )
    return +`${moment().utcOffset(8).format('YYMMDD')}${_.padStart(res.value.seqValue.toString(), 10, '0')}`
}

// 检查用户合法性
async function checkHandlerPoint(inparam) {
    const collectionName = inparam.role == RoleEnum.agent ? CollectionEnum.agent : CollectionEnum.player
    const user = await global.mongodb.collection(collectionName).findOne({ id: inparam.id })
    if (!user || user.status == 0) {
        throw { err: true, res: '帐号不存在或被停用' }
    }
    const id = user.id
    let ownerName = user.userName
    let ownerNick = user.userNick
    const parentId = user.parentId
    const parentName = user.parentName
    const parentNick = user.parentNick
    if (inparam.role == RoleEnum.player) {
        let mixAmount = await getPlayerMixAmount(inparam)[0]
        console.log(mixAmount)
        console.log(mixAmount * 2 < user.balance)
        if (mixAmount * 2 < user.balance) {
            throw { err: true, res: '玩家流水不足' }
        }
        ownerName = user.playerName
        ownerNick = user.playerNick
    }
    return { id, ownerName, ownerNick, parentId, parentName, parentNick }
}

// 获取玩家有效投注的流水值
async function getPlayerMixAmount(player) {
    // 查找玩家最近是否有取款记录
    let lastBillTime = 0
    let reviewArr = await global.mongodb.collection(CollectionEnum.review).find({ id: player.id, project: ProjectEnum.Withdraw, status: ReviewEnum.Agree }, { projection: { reviewAt: 1, _id: 0 } }).sort({ id: -1 }).limit(1).toArray()
    if (reviewArr.length != 0) {
        lastBillTime = reviewArr[0].reviewAt
    }
    // 查询玩家目前流水值
    let rounds = await global.mongodb.collection(CollectionEnum.vround).find({ ownerId: player.id, minCreateAt: { $gte: lastBillTime, $lte: Date.now() } }, { projection: { winloseAmount: 1, bills: 1, _id: 0 } }).toArray()
    let mixAmount = 0
    for (let round of rounds) {
        // 当局输赢
        let roundWinloseAmount = +round.winloseAmount.toFixed(2)
        // 累计有效投注
        let roundBetAmount = _.sumBy(round.bills, o => { if (o.project == ProjectEnum.Bet) return Math.abs(o.amount) })
        let roundValidBetAmount = Math.min(Math.abs(+roundBetAmount.toFixed(2)), Math.abs(roundWinloseAmount))
        mixAmount = NP.plus(mixAmount, roundValidBetAmount)
    }
    console.log(mixAmount, lastBillTime)
    return [mixAmount, lastBillTime]
}

//获取代理相关费用
function calcRebateFee(rounds, bills, configArr, data) {
    let platFeeMap = {}
    // 遍历所有游戏记录
    for (let round of rounds) {
        // 当局输赢
        let roundWinloseAmount = +round.winloseAmount.toFixed(2)
        // 累计输赢
        data.winlose = NP.plus(data.winlose, roundWinloseAmount)
        // 累计有效投注
        let roundBetAmount = _.sumBy(round.bills, o => { if (o.project == ProjectEnum.Bet) return Math.abs(o.amount) })
        let roundValidBetAmount = Math.min(Math.abs(+roundBetAmount.toFixed(2)), Math.abs(roundWinloseAmount))
        data.commission = NP.plus(data.commission, roundValidBetAmount)
        // 累计平台输赢
        let sourceGameId = round.sourceGameId.toString()
        let plat = `${sourceGameId.substring(0, sourceGameId.length - 2)}00`
        platFeeMap[plat] = platFeeMap[plat] ? NP.plus(platFeeMap[plat], roundWinloseAmount) : roundWinloseAmount
    }
    // 使用佣金比例计算佣金
    data.commissionFee = +(data.commission * _.find(configArr, o => o.id == 'commission').value / 100).toFixed(2)
    // 使用平台费比例计算平台费
    for (let plat in platFeeMap) {
        data.platformFee = NP.plus(data.platformFee, +(platFeeMap[plat] * _.find(configArr, o => o.id == plat).value / 100).toFixed(2))
    }
    // 累计玩家存取款
    for (let bill of bills) {
        if (bill.project == ProjectEnum.Deposit) {
            data.deposit = NP.plus(data.deposit, Math.abs(bill.amount))
        } else {
            data.withdraw = NP.plus(data.withdraw, Math.abs(bill.amount))
        }
    }
    // 使用手续费比例计算存取手续费
    data.depositFee = +(data.deposit * _.find(configArr, o => o.id == 'deposit').value / 100).toFixed(2)
    data.withdrawFee = +(data.withdraw * _.find(configArr, o => o.id == 'withdraw').value / 100).toFixed(2)
    data.winlose *= -1           // 总输赢取反
    data.platformFee *= -1       // 平台费取反
    // 当前利润（当前输赢 - 成本）* 业务模式比例
    data.profit = +((data.winlose - data.commissionFee - data.platformFee - data.depositFee - data.withdrawFee) * data.modeValue / 100).toFixed(2)
    return data
}

// // 向N1注册玩家
// async function n1RegPlayer(userName, nickname) {
//     try {
//         let res = await axios.post(`https://${config.n1.domain}/dev/player/register`, {
//             buId: config.n1.buId,
//             apiKey: config.n1.apiKey,
//             userName,
//             nickname,
//             userPwd: "123456",
//         })
//         if (res.data.code == 0) {
//             return { err: false }
//         } else {
//             return { err: true, res: res.data.msg }
//         }
//     } catch (error) {
//         return { err: true, res: '网络不稳定，请稍候重试' }
//     }
// }

// // 向N1玩家转点
// async function n1Transfer(userName, action, amount) {
//     let sn = `${123456}_${userName}_${Date.now()}】`
//     try {
//         let res = await axios.post(`https://${config.n1.domain}/dev/merchant/player`, {
//             method: "OPERATE_PLAYER_BALANCE",
//             buId: config.n1.buId,
//             apiKey: config.n1.apiKey,
//             userName,
//             action,
//             amount,
//             sn
//         })
//         if (res.data.code == 0) {
//             return { err: false }
//         } else {
//             console.error('N1充值/提现失败')
//             console.error(res.data)
//             return { err: true, res: res.data.msg }
//         }
//     } catch (error) {
//         return await checkSn(sn)
//     }
// }

// // 向N1检查充值/提现是否成功
// async function checkSn(sn) {
//     try {
//         let res = await axios.post(`https://${config.n1.domain}/dev/merchant/player`, {
//             method: "QUERY_PLAYER_SN",
//             buId: config.n1.buId,
//             apiKey: config.n1.apiKey,
//             sn
//         })
//         if (res.data.code == 0) {
//             return res.data.isExist
//         } else {
//             console.error('N1检查SN失败')
//             console.error(res.data)
//             checkSn(sn)
//         }
//     } catch (error) {
//         checkSn(sn)
//     }
// }

module.exports = {
    ProjectEnum,
    RoleEnum,
    CollectionEnum,
    ReviewEnum,
    StatusEnum,
    ModeEnum,

    ProjectStrEnum,
    ModeStrEnum,

    MsgEnum,
    MsgStrEnum,

    GameStrEnum,
    PlatStrEnum,

    getSeq,
    checkType,
    checkHandlerPoint,
    calcRebateFee,
    getPlayerMixAmount
}