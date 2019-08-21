const _ = require('lodash')
const moment = require('moment')
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
    '70001': '',
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

    n1RegPlayer,
    n1Transfer,

    checkType,
    getSeq
}